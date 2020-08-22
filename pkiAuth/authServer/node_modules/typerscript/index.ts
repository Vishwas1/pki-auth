import * as React from 'react'
import { style as typeStyle } from 'typestyle'

const __ = { IS_NATIVE__: false }
// This avoids allocating new empty objects all the time
const EmptyObject = Object.freeze({})
const objIsLocked = (obj: any) =>
	!Object.isExtensible(obj) || Object.isFrozen(obj) || Object.isSealed(obj)

// declare var process: any;
// declare var __: {IS_NATIVE__: boolean}
// try { if (!__) {} }
// catch(e) {
// 	let __ = {IS_NATIVE__: false}
// }

interface Selector {
	id?: string;
	className?: string;
}

export class Style<T extends object = any> {
	selector: string;
	rules: T;
	constructor({ selector, rules }: {selector: string, rules: T}) {
		const firstChar = selector[0]
		this.selector = firstChar === '.' || firstChar === '#' ? selector : '.' + selector
		this.rules = rules
	}
}

export type IClass = { [key: string]: object }
export type IClasses<T extends IClass> = {
	[K in keyof T]: Style<T[K]>
}

export function createClasses<T extends IClass>(classes: T) {
	const styles: IClasses<T> = {} as IClasses<T>

	Object.entries(classes).forEach(([key, val]) => {
		const selector = __.IS_NATIVE__ ? key : typeStyle({ $debugName: key, ...val })
		styles[key] = new Style({
			rules: val,
			selector,
		})
	})

	return styles
}

//const isValidString = param => typeof param === 'string' && param.length > 0
const startsWith = (str: string, start: string) => str[0] === start
//const isValidSelector = param => isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'))
const isStyleObject = (param: any) => param instanceof Style
// isSelectorOrStyle = param => isValidString(param) || isStyleObject(param)
const isSelector = (param: any) => typeof param === 'string'
const isChildren = Array.isArray

const classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/
function parseSelector(selector: string) {
	const parts = selector.split(classIdSplit)
	let classNames = []
	let id
	for (let part of parts) {
		if (part.startsWith('#')) id = part.substring(1)
		else if (part.startsWith('.')) classNames.push(part.substring(1))
	}
	const className = classNames.join(' ')

	if (id && className) { return { id, className } }
	if (id) { return { id } }
	if (className) { return { className } }

	return undefined
}

function createElement(nameOrType: any, properties: any={isRendered: true}, children: any[]=[]) {
	const { isRendered, ...props } = properties
	if (!isRendered && isRendered !== undefined) return null

	const args = [nameOrType, props]
	if (!Array.isArray(children)) {
		args.push(children)
	} else {
		args.push(...children)
	}

	return React.createElement.apply(React, args)
}

type filterObjectPredicate = (value: any, key: string) => boolean
function filterObject(obj: {[key: string]: any}, predicate: filterObjectPredicate ) {
  return Object.assign({},
		...Object.keys(obj)
			.filter( key => predicate(obj[key], key) )
			.map((key: string) => ({ [key]: obj[key] }))
	)
}
const flexKeys = ['flex', 'flexGrow', 'flexShrink', 'flexBasis']
const getFlexObj = (rules: {[key: string]: any}) => filterObject(
	rules,
	(value: any, key: string) => flexKeys.includes(key),
)

export function _hh<T, Props>(first: string|Style, second: Props, third?: any[]): any
export function _hh<T, Props>(first: string|Style, second?: Props|any[]): any
export function _hh<T, Props>(first: Props, second?: any[]): any
export function _hh<T, Props>(first?: string|Style|Props|any[]): any
export function _hh<T, Props>(..._args: any[]): any{}

export type ComponentType<P> = (React.ReactElement<P>)
export type ReactHTMLElement = any
// export type SVGHTMLElement = any
export type ReactElement = any
import {
	Attributes,
	ClassicComponent,
	Component,
	ComponentClass,
	ComponentState,
	ClassicComponentClass,
	ClassType,
  DOMAttributes,
	HTMLAttributes,
	InputHTMLAttributes,
	ReactHTML,
//	ReactSVG,
	SFC,
	StatelessComponent,
//	SVGAttributes,
	ClassAttributes,
} from 'react'

export type options<P> = (
		| ComponentClass<P>
		| string
)
export type NameOrType<P,T> = (
	'input'
		// | ReactSVG
		| ReactHTML
		| string
		| Function
		| StatelessComponent<P>
		| SFC<P>
		| ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>
		| options<P>
)

export type BaseProps<T> = (
//	T extends SVGElement ? SVGAttributes<T> :
		T extends ReactHTMLElement ? HTMLAttributes<T> :
		T extends Element ? DOMAttributes<T> : {}
)
export type AttrProps<P> = Attributes & P
export type ComponentWState<P> = (Component<P, ComponentState>)

export function hh<P, T extends NameOrType<P,T>>(nameOrType: T): typeof _hh
export function hh<P, T extends ComponentWState<P>, C extends ComponentClass<P>>(nameOrType: ClassType<P, T, C>): typeof _hh {
	type Props = (
		T extends ReactHTMLElement ? HTMLAttributes<T> :
			T extends Element ? DOMAttributes<T> :
			T extends 'input' ? (InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null) :
			T extends StatelessComponent<P> ? Attributes & P :
			T extends Function ? Attributes & P :
			// T extends SFC<P> ? Attributes & P :
			T extends ComponentClass<P> ? Attributes & P :
			T extends ComponentWState<P> ? ClassAttributes<ClassicComponent<P, ComponentState>> & P | null :
			ClassAttributes<T> & P | null
	)

	return ((...args: any[]) => h<T, Props>(nameOrType, ...args)) as typeof _hh
}

function h<T, Props>(nameOrType: any, first: string|Style, second: Props, third?: any[]): any
function h<T, Props>(nameOrType: any, first: string|Style, second?: Props|any[]): any
function h<T, Props>(nameOrType: any, first: Props, second?: any[]): any
function h<T, Props>(nameOrType: any, first?: string|Style|Props|any[]): any
function h<T, Props>(nameOrType: any, ..._args: any[]) {
	// const name = nameOrType.displayName || nameOrType.name || nameOrType
	let selector: Selector | undefined
	let rules: { [index: string]: any }
	let props: { [index: string]: any }
	let children: any[]
	let isLocked = false
	const args = _args.filter((arg: any) => arg !== undefined)
	let arg = 0
	if (isSelector(args[arg])) {
		selector = parseSelector(args[arg])
		arg++
	} else if (isStyleObject(args[arg])) {
		selector = parseSelector(args[arg].selector)
		// if (__.IS_NATIVE__) {
		rules = args[arg].rules
		// }
		arg++
	}

	if (typeof args[arg] === 'object' && !isChildren(args[arg])) {
		props = args[arg]
		isLocked = true
		arg++
	} else props = {}

	if (isChildren(args[arg])) {
		children = args[arg]
	}

	if (__.IS_NATIVE__) {
		if (isLocked) { props = { ...props } }
		props.style = props.style ? { ...rules, ...props.style } : rules
	} else if (rules) {
		if (isLocked) { props = { ...props } }
		// react-native-web needs 'flex' props as an actual style prop in order
		// to work correctly
		const flexObj = getFlexObj(rules)
		if (Object.keys(flexObj).length > 0) {
			props.style = props.style ? { ...flexObj, ...props.style } : flexObj
		}
	}
	if (selector) {
		props = {...selector, ...props}
	}
	// In some cases, e.g. react-native's TouchableWithoutFeedback we will get
	// 'Error: React.Children.only expected to receive a single React element child.'
	// when passing an array, so if there is only one child, just put that
	return createElement(nameOrType, props, children)
}

export { h }

PORT_SSI_EXPLORER=5001
PORT_SSI_REGISTRY=5000
PORT_ISSUER_CLIENT=9001
PORT_ISSUER_SERVER=9000

LOG="logs"

echo 'Cleanup:=============================================='
#pm2 del all 
PID_SSI_EXPLORER=$(lsof -i:$PORT_SSI_EXPLORER | awk '$1 == "node" { print $2}')
kill -9 $PID_SSI_EXPLORER

PID_SSI_REGISTRY=$(lsof -i:$PORT_SSI_REGISTRY | awk '$1 == "node" { print $2}')
kill -9 $PID_SSI_REGISTRY

PID_ISSUER_CLIENT=$(lsof -i:$PORT_ISSUER_CLIENT | awk '$1 == "node" { print $2}')
kill -9 $PID_ISSUER_CLIENT

PID_ISSUER_SERVER=$(lsof -i:$PORT_ISSUER_SERVER | awk '$1 == "node" { print $2}')
kill -9 $PID_ISSUER_SERVER

rm -rf $LOG
echo 'Cleanup:==============================================Done!'
exit
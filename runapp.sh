echo 'Stopping:=============================================='
./stop.sh
echo 'Stopping:=============================================='


LOG='logs'
mkdir $LOG

echo 'Restarting:=============================================='
cd hs-ssi-infra/registry 
nohup npm run dev > ../../$LOG/registry.log &
cd -
cd hs-ssi-infra/explorer 
nohup npm run serve  > ../../$LOG/explorer.log &
cd -
cd issuer/server
nohup npm run dev > ../../$LOG/issuer_server.log &
cd -
cd issuer/client
nohup npm run serve > ../../$LOG/issuer_client.log &
#pm2 start src/app.ts --
#pm2 start index.js --name provider -- -port $PROIVER_PORT
# cd -
# cd consumer
# pm2 start index.js --name consumer -- -port $CONSUMER_PORT
# pm2 flush all
# pm2 logs consumer
echo 'Restarting:==============================================Done!'

exit

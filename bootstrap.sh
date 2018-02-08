echo "----- init -----"
npm run bookie.test init

echo "... waiting 10"
sleep 10

echo "----- createTeams -----"
npm run bookie.test createTeams

echo "... waiting 10"
sleep 10

echo "----- createWagers -----"
npm run bookie.test createWagers

echo "... waiting 10"
sleep 10

echo "----- placeBets -----"
npm run bookie.test placeBets

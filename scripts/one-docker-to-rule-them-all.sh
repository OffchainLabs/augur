#!/bin/bash

set -euo pipefail

cleanup() {
  echo "stopping geth docker image"
  docker kill geth
  yarn workspace @augurproject/gnosis-relay-api kill-relay
}

trap cleanup SIGINT SIGTERM

# true true will give you uploaded contracts and time controlled
DEV="${1-false}"
FAKE_TIME="${2-false}"

# make sure we have the latest images
# (workaround until next version of docker supports the --pull flag)
docker pull augurproject/safe-relay-service_web:latest
docker pull 0xorg/mesh:latest

echo "Deploy contracts: $DEV"
echo "Use fake time: $FAKE_TIME"
# run docker image, creating or updating local-addresses.json
if [ "$DEV" == "true" ]; then
  yarn workspace @augurproject/tools docker:geth:detached
  ###############################################################################
  # PG: This section is idenntical to run-geth-and-deploy.sh, some time we
  # should move it all into flash and fix the Addresses so that they can be
  # reloaded.
  # Until then -- Make sure changes work in BOTH scripts

  if [ "$FAKE_TIME" == "true" ]; then
    yarn flash fake-all --createMarkets
  else
    yarn flash normal-all --createMarkets
  fi

  # pick up the creation of / changes to local-addresses.json
  yarn build

  ###############################################################################
else
  if [ "$FAKE_TIME" == "true" ]; then
    echo "using fake time deploy"
    yarn docker:geth:pop
  else
    echo "using normal deploy"
    yarn docker:geth:pop-normal-time
  fi
  # pick up the creation of / changes to local-addresses.json
  yarn build
fi


# run docker ecosystem with variables derived from geth node
export ETHEREUM_CHAIN_ID=`yarn --silent flash network-id | sed '1d'`
export CUSTOM_CONTRACT_ADDRESSES=`yarn --silent flash get-all-contract-addresses --ugly | sed '1d'`
export GNOSIS_SAFE_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address -n GnosisSafe | sed '1d'`
export PROXY_FACTORY_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address -n ProxyFactory | sed '1d'`
export ZEROX_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address -n ZeroXTrade -r -l | sed '1d'`
#yarn docker:gnosis

if [[ "${DETACH-false}" == "true" ]]; then
  yarn workspace @augurproject/gnosis-relay-api run-relay -d
else
  yarn workspace @augurproject/gnosis-relay-api run-relay
fi


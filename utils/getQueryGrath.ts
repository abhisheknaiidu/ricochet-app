export const getQueryGrath = (queryAddress: string) => `{
  account(id: "${queryAddress.toLowerCase()}") {
    inflows(first: 1000) {
      currentFlowRate
      receiver {
        id
      }
      sender {
        id
      }
      token {
        id
        symbol
      }
      flowUpdatedEvents {
        flowRate
        timestamp
        totalReceiverFlowRate
      }
      updatedAtTimestamp
    }
    outflows(first: 1000, where: {currentFlowRate_gt: "0"}) {
      currentFlowRate
      updatedAtTimestamp
      sender {
        id
      }
      token {
        id
        symbol
      }
      flowUpdatedEvents {
        flowRate
        timestamp
        totalSenderFlowRate
      }
    }
  }
}`;

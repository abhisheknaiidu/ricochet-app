import { Flow } from "types/flow";


export const getReceviedFlows = (flows: Flow[], tokenAddress:string, address: string) => {
  const sum = flows?.reduce((acc, flow) => {
    if (flow?.token?.id === tokenAddress?.toLowerCase() &&
    flow?.sender?.id === address?.toLowerCase()) {
      return acc + parseInt(flow.currentFlowRate, 10);
    }
    return acc;
  }, 0);
  return sum;
};

export type Flow = {
	currentFlowRate: string;
	updatedAtTimestamp: string;
	sender: {
		id: string;
	};
	token: {
		id: string;
		symbol: string;
	};
	flowUpdatedEvents: {
		flowRate: string;
		timestamp: string;
		totalSenderFlowRate: string;
	};
};

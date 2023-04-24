import calculateStreamedSoFar from './calculateStreamedSoFar';

export const getReceived = (received: any[], receivedSoFarMap: Record<string, number>) => {
	(received || []).forEach((stream: any) => {
		const receivedSoFar = receivedSoFarMap[`${stream.token.id}-${stream.sender.id}`] || 0;
		Object.assign(receivedSoFarMap, {
			[`${stream.token.id}-${stream.sender.id}`]:
				Number(receivedSoFar) +
				Number(
					calculateStreamedSoFar(stream.streamedUntilUpdatedAt, stream.updatedAtTimestamp, stream.currentFlowRate)
				),
		});
	});
};

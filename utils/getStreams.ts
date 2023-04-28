import calculateStreamedSoFar from './calculateStreamedSoFar';

export const getStreams = (streams: any[], streamedSoFarMap: Record<string, number>) => {
	(streams || []).forEach((stream: any) => {
		const streamedSoFar = streamedSoFarMap[`${stream.token.id}-${stream.receiver.id}`] || 0;
		Object.assign(streamedSoFarMap, {
			[`${stream.token.id}-${stream.receiver.id}`]:
				Number(streamedSoFar) +
				Number(
					calculateStreamedSoFar(stream.streamedUntilUpdatedAt, stream.updatedAtTimestamp, stream.currentFlowRate)
				),
		});
	});
};
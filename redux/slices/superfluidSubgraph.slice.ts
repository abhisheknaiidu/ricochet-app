import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { getQueryDistributions } from '@richochet/utils/getQueryDistributions';
import { getQueryGrath } from '@richochet/utils/getQueryGrath';
import { getQueryReceived } from '@richochet/utils/getQueryReceived';
import { getQueryStreams } from '@richochet/utils/getQueryStreams';

const superfluidSubgraphApi = createApi({
	keepUnusedDataFor: 60, // 60 seconds (default)
	reducerPath: 'superfluidSubgraph',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://api.thegraph.com/subgraphs/name/superfluid-finance' }),
	endpoints: (builder) => ({
		queryFlows: builder.mutation({
			query: ({queryAddress, network}) => ({
				url: `${network}`,
				method: 'POST',
				headers: new Headers({
					'content-type': 'application/json ',
				}),
				body: { query: getQueryGrath(queryAddress) },
			}),
		}),
		queryDistributions: builder.mutation({
			query: ({subscriber, network}) => ({
				url: `${network}`,
				method: 'POST',
				body: { query: getQueryDistributions(subscriber) },
			}),
		}),
		queryStreams: builder.mutation({
			query: ({address, network}) => ({
				url: `${network}`,
				method: 'POST',
				body: { query: getQueryStreams(address) },
			}),
		}),
		queryReceived: builder.mutation({
			query: ({receiver, network}) => ({
				url: `${network}`,
				method: 'POST',
				body: { query: getQueryReceived(receiver) },
			}),
		}),
	}),
});

export default superfluidSubgraphApi;

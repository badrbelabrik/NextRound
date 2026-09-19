import api from './api';

export async function getDashboardData() {
    const [
        tournamentsResponse,
        registrationsResponse,
        matchesResponse,
        resultsResponse,
    ] = await Promise.all([
        api.get('/my-tournaments'),
        api.get('/my-registrations'),
        api.get('/my-matches'),
        api.get('/my-results'),
    ]);

    return {
        tournaments: tournamentsResponse.data,
        registrations: registrationsResponse.data,
        matches: matchesResponse.data,
        results: resultsResponse.data,
    };
}
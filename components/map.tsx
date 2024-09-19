"use client";
import React, { useEffect, useState } from 'react';
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap
} from '@vis.gl/react-google-maps';
import { useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { format } from 'date-fns';

const API_KEY = "AIzaSyA8fvaz-leRXM8RdB3tFJWmuExdWCI9USs";

export const DirectionMap = ({ memberId, date }: { memberId: string, date: any }) => {
    const [locations, setLocations] = useState<any[]>([]);
    const [dailyLocation, setDailyLocation] = useState<{ lat: number; lng: number; timestamp?: string; batteryPercentage?: number; networkStrength?: string }[]>([]); //daily location coordinates

    const { data } = useQuery(userQueries.GET_MEMBER_LOCATION, {
        variables: {
            memberId: memberId,
            date: format(date, 'dd-MM-yyyy'),
        },
        skip: !memberId || !date,
        onSuccess: ({ data }) => {
            if (data?.getMemberLocation) {
                setLocations(data.getMemberLocation.locations);
            }
        }
    });

    useEffect(() => {
        if (data?.getMemberLocation?.locations) {
            const chunks = chunkArrayIntoMax20Arrays(data.getMemberLocation.locations);
            const destinationPoints: any[] = chunks.map((array, index) => {
                if (index === chunks.length - 1) {
                    return array[array.length - 1]; // Last item of the last array
                } else {
                    return array[0]; // First item of all other arrays
                }
            });
            setDailyLocation(destinationPoints);
        }
    }, [data]);

    const chunkArrayIntoMax20Arrays = (array: any[]) => {
        const maxArrays = 20;
        const chunkSize = Math.ceil(array.length / maxArrays);
        const result = [];
        const formattedArray = array.map((item: any) => ({
            lat: item.latitude,
            lng: item.longitude,
            timestamp: item.timestamp,
            batteryPercentage: item.batteryPercentage,
            networkStrength: item.networkStrength,
        }));

        for (let i = 0; i < formattedArray.length; i += chunkSize) {
            result.push(formattedArray.slice(i, i + chunkSize));
        }

        return result;
    };

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
                defaultZoom={13}
                gestureHandling={'greedy'}
                className="h-[50vh] w-full"
            >
                <Directions locations={dailyLocation} />
            </Map>
        </APIProvider>
    );
};

function Directions({ locations }: { locations: { lat: number; lng: number }[] }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] =
        useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] =
        useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer || locations.length < 2) return;

        const origin = locations[0];
        const destination = locations[locations.length - 1];
        const waypoints = locations.slice(1, -1).map(location => ({
            location: new google.maps.LatLng(location.lat, location.lng),
            stopover: true,
        }));

        directionsService.route({
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(destination.lat, destination.lng),
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        })
            .then(response => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            });

        return () => directionsRenderer.setMap(null);
    }, [directionsService, directionsRenderer, locations]);

    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className="directions">
            <h2>{selected.summary}</h2>
            <p>
                {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>

            <h2>Other Routes</h2>
            <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button onClick={() => setRouteIndex(index)}>
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

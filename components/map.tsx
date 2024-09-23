"use client";
import React, { useEffect, useState } from 'react';
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
    Marker
} from '@vis.gl/react-google-maps';
import { useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { format } from 'date-fns';

const API_KEY = "AIzaSyA8fvaz-leRXM8RdB3tFJWmuExdWCI9USs";

export const DirectionMap = ({ memberId, date }: { memberId: string, date: any }) => {
    const [locations, setLocations] = useState<any[]>([]);
    const [dailyLocation, setDailyLocation] = useState<{ lat: number; lng: number; timestamp?: string; batteryPercentage?: number; networkStrength?: string, movingTime?: string }[]>([]); // daily location coordinates

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
            movingTime: item.movingTime,
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

function Directions({ locations }: { locations: { lat: number; lng: number; timestamp?: string; batteryPercentage?: number; networkStrength?: string, movingTime?: string }[] }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, markerOptions: {} }));
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
            provideRouteAlternatives: false
        }).then(response => {
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

    const distanceResult = calculateTotalDistanceAndTime(locations.map(location => ({
        ...location,
        movingTime: location.movingTime || '0'
    })))

    return (
        <>
            <div className="directions">
                <p>Total Distance: {distanceResult.totalDistance}</p>
                <p>Total Duration: {distanceResult.totalMovingTime}</p>
            </div>

            {/* Use the existing marker in your Directions */}
            {locations.map((location, index) => {
                const markerTime = location.timestamp
                    ? new Date(location.timestamp).toLocaleString()
                    : 'Unknown time';
                const battery = location.batteryPercentage ? `${location.batteryPercentage.toFixed(0)}%` : 'Unknown';
                const network = location.networkStrength ? location.networkStrength : 'Unknown';

                return (
                    <Marker
                        key={index}
                        position={{ lat: location.lat, lng: location.lng }}
                        title={`Updated at ${markerTime}, Battery: ${battery}, Internet: ${network}`}
                        icon={{
                            url: 'https://img.icons8.com/?size=30&id=85472&format=png&color=D00C0C',
                            // @ts-ignore
                            size: { width: 30, height: 30 },
                        }}
                    />
                );
            })}
        </>
    );
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

function calculateTotalDistanceAndTime(locations: { lat: number; lng: number; movingTime: string }[]): { totalDistance: string; totalMovingTime: string } {
    let totalDistanceInMeters = 0;
    let totalMovingTimeInSeconds = 0;

    for (let i = 0; i < locations.length - 1; i++) {
        const distance = haversineDistance(
            locations[i].lat,
            locations[i].lng,
            locations[i + 1].lat,
            locations[i + 1].lng
        );
        totalDistanceInMeters += distance;
        
        // Add the moving time from the current location (convert ms to seconds)
        totalMovingTimeInSeconds += parseInt(locations[i].movingTime, 10) / 1000;
    }

    // Convert distance from meters to kilometers
    const totalDistanceInKilometers = (totalDistanceInMeters / 1000).toFixed(2);

    // Convert duration from seconds to a more readable format (HH:MM:SS)
    const totalHours = Math.floor(totalMovingTimeInSeconds / 3600);
    const totalMinutes = Math.floor((totalMovingTimeInSeconds % 3600) / 60);
    const totalSeconds = totalMovingTimeInSeconds % 60;

    const totalMovingTime = `${totalHours}h ${totalMinutes}m ${totalSeconds.toFixed(0)}s`;

    return {
        totalDistance: `${totalDistanceInKilometers} km`,
        totalMovingTime: totalMovingTime,
    };
}
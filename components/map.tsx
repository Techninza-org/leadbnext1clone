"use client";
import React, { useEffect, useState } from 'react'
import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { format } from 'date-fns';

const Map = ({ memberId, date }: { memberId: string, date: any }) => {
    const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
    const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
    const [directions, setDirections] = useState(null);

    // user data
    const [totalTime, setTotalTime] = useState({
        hrs: "",
        min: "",
        sec: ""
    });
    const [totalIdelTime, setTotalIdelTime] = useState({
        hrs: "",
        min: "",
        sec: ""
    });
    const [totalDistance, setTotalDistance] = useState("");
    const [dailyLocation, setDailyLocation] = useState<{ latitude: number; longitude: number; timestamp?: string; batteryPercentage?: number; networkStrength?: string }[]>([]); //daily location coordinates
    const [locations, setLocations] = useState<any[]>([]);

    const containerStyle = {
        width: '100%',
        height: '60vh',
    };

    const defaultCenter = {
        lat: 28.7041,
        lng: 77.1025,
    };

    const chunkArrayIntoMax20Arrays = (array: string | any[]) => {
        const maxArrays = 20;
        const chunkSize = Math.ceil(array.length / maxArrays);
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const { data } = useQuery(userQueries.GET_MEMBER_LOCATION, {
        variables: {
            memberId: memberId,
            date: format(date, 'dd-MM-yyyy'),
        },
        skip: !memberId || !date,
        onSuccess: ({ data }) => {
            if (data?.getMemberLocation) {
                setLocations(data.getMemberLocation);
            }
        }
    });

    useEffect(() => {
        if (data?.getMemberLocation) {
            setLocations(data.getMemberLocation);
        }
    }, [data]);

    useEffect(() => {
        if (dailyLocation !== undefined && dailyLocation[0] !== null && dailyLocation[1] !== undefined) {
            const intialRegion = dailyLocation[0];
            setCurrentLatitude(intialRegion?.latitude);
            setCurrentLongitude(intialRegion?.longitude);
        }
    }, [dailyLocation]);

    useEffect(() => {
        if (data?.getMemberLocation?.locations !== undefined) {
            const chunks = chunkArrayIntoMax20Arrays(data?.getMemberLocation?.locations);
            const destinationPoints: any[] = chunks?.map((array, index) => {
                if (index === chunks.length - 1) {
                    return array[array.length - 1]; // Last item of the last array
                } else {
                    return array[0]; // First item of all other arrays
                }
            });
            setDailyLocation(destinationPoints);
        }
    }, [data]);

    useEffect(() => {
        if (dailyLocation.length >= 2) {
            const waypoints = dailyLocation.slice(1, dailyLocation.length - 1).map((location) => ({
                location: { lat: location.latitude, lng: location.longitude },
                stopover: true,
            }));

            const origin = { lat: dailyLocation[0].latitude, lng: dailyLocation[0].longitude };
            const destination = { lat: dailyLocation[dailyLocation.length - 1].latitude, lng: dailyLocation[dailyLocation.length - 1].longitude };

            if (window.google && window.google.maps && window.google.maps.DirectionsService) {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route(
                    {
                        origin,
                        destination,
                        waypoints: waypoints,
                        // @ts-ignore
                        travelMode: 'TRANSIT',
                    },
                    (result: any, status: any) => {
                        if (status === 'OK') {
                            setDirections(result);
                        } else {
                            console.error(`Error fetching directions: ${status}`);
                        }
                    }
                );
            } else {
                console.error('Google Maps API is not loaded');
            }
        }
    }, [dailyLocation]);


    if (dailyLocation.length === 0) {
        return <div>Locations not available...</div>;
    }

    return (
        <LoadScript googleMapsApiKey="AIzaSyA8fvaz-leRXM8RdB3tFJWmuExdWCI9USs">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                    lat: dailyLocation[0]?.latitude || defaultCenter.lat,
                    lng: dailyLocation[0]?.longitude || defaultCenter.lng
                }}
                zoom={15}
            >
                {dailyLocation.map((location: any, index: number) => {
                    const markerTime = format(new Date(location?.timestamp), 'hh:mm:ss a');
                    const battery = Number(location?.batteryPercentage).toFixed(0);
                    const network = location?.networkStrength;
                    return (
                        <Marker
                            key={index}
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title={`Updated at ${markerTime}, Battery: ${battery}, Network: ${network}`}
                        />
                    );
                })}

                {directions && (
                    <DirectionsRenderer
                        options={{
                            directions: directions,
                            polylineOptions: {
                                strokeColor: 'blue',
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                            },
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;

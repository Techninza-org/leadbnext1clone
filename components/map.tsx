'use client'
import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { format } from 'date-fns';

const Map = ({memberId, date}: {memberId: string, date: any}) => {
    // console.log(memberId,  format(date, 'dd-MM-yyyy'), 'map');
    
    const containerStyle = {
        width: '100%',
        height: '60vh'
    };

    const centre = {
        lat: 37.437041393899676,
        lng: -4.191635586788259
    };

    const locations = [
        { lat: 37.437041393899676, lng: -4.191635586788259 },
        { lat: 37.440575591901045, lng: -4.231433159434073 },
    ];

    function calculateTimeDifference(startTime: number, endTime: number) {
        const startDate = new Date(startTime).getTime();
        const endDate = new Date(endTime).getTime();

        const differenceInMillis = endDate - startDate;

        const hours = Math.floor(differenceInMillis / (1000 * 60 * 60));
        const minutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((differenceInMillis % (1000 * 60)) / 1000);
    
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    
    }

    const haversineDistance = (coord1: any, coord2: any) => {
        const toRad = (value: any) => (value * Math.PI) / 180;
    
        const lat1 = coord1.latitude;
        const lon1 = coord1.longitude;
        const lat2 = coord2.latitude;
        const lon2 = coord2.longitude;
    
        const R = 6371; 
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c; 
    };
    
    

    //  const {data, loading} = useQuery(userQueries.GET_MEMBER_LOCATION, {
    //         variables: {
    //             memberId: memberId,
    //             date: format(date, 'dd-MM-yyyy') || new Date(),
    //         },
    //         onSuccess: (data) => {
    //             console.log(data, 'location')
    //         }
    //     })
    return (
        <LoadScript googleMapsApiKey='AIzaSyA8fvaz-leRXM8RdB3tFJWmuExdWCI9USs'>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={centre}
                zoom={10}
            >
                {locations.map((location, index) => (
                    <Marker key={index} position={location} />
                ))}
            </GoogleMap>
        </LoadScript>
    )
}

export default Map
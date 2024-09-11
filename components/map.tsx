import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { useQuery } from 'graphql-hooks';
import { userQueries } from '@/lib/graphql/user/queries';
import { format } from 'date-fns';

function calculateTimeDifference(startTime: string | number | Date, endTime: string | number | Date) {
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
    // Alternatively, you can return a formatted string
    // return ${hours} hours, ${minutes} minutes, and ${seconds} seconds;
}

const haversineDistance = (coord1: { latitude: any; longitude: any; }, coord2: { latitude: any; longitude: any; }) => {
    const toRad = (value: number) => (value * Math.PI) / 180;

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

const calculateTotalDistance = (chunks: any[]) => {
    let totalDistance = 0;
    chunks.forEach(chunk => {
        if (chunk.length > 1) {
            const firstPoint = chunk[0];
            const lastPoint = chunk[chunk.length - 1];

            totalDistance += haversineDistance(firstPoint, lastPoint);
        }
    });

    return { totalDistance };
};

function convertSecondsToHMS(totalSeconds: number) {
    var actualSeconds = totalSeconds / 1000;
    const hours = Math.floor(actualSeconds / 3600);
    const minutes = Math.floor((actualSeconds % 3600) / 60);
    const seconds = actualSeconds % 60;

    return {
        hours,
        minutes,
        seconds
    };
}

function calculateAndConvertTotalIdelTime(data: any[]) {
    const idleTimes = data.map(item => {
        const time = parseInt(item.idleTime, 10);
        return isNaN(time) ? 0 : time;
    });

    let totalTime = 0;
    let i = 0;

    while (i < idleTimes.length) {
        if (idleTimes[i] !== 0) {
            if (i + 1 < idleTimes.length && idleTimes[i + 1] === 0) {
                totalTime += idleTimes[i];
            }
        }
        i++;
    }

    return convertSecondsToHMS(totalTime);
}

const Map = ({ memberId, date }: { memberId: string, date: any }) => {
    console.log(memberId, format(date, 'dd-MM-yyyy'), 'map');
    const [currentLongitude, setCurrentLongitude] = useState(null);
    const [currentLatitude, setCurrentLatitude] = useState(null);

    const [stopFlikker, setStopFlikker] = useState(true);
    setTimeout(() => {
        setStopFlikker(false);
    }, 3000);


    // user data
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedMembers, setSelectedMembers] = useState({});

    // map data
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
    const [dailyLocation, setDailyLocation] = useState([]); //daily location co-ordinates:----
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);


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


    const { data, loading, error } = useQuery(userQueries.GET_MEMBER_LOCATION, {
        variables: {
            memberId: memberId,
            date: format(date, 'dd-MM-yyyy'),
        },
        skip: !memberId || !date,
        onSuccess: (data) => {
            console.log(data, 'location');

            if ((data as any)?.getMemberLocation) {
                setLocations((data as any).getMemberLocation);
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
            var intialRegion = dailyLocation[0];
            //@ts-ignore
            setCurrentLatitude(intialRegion?.latitude);
            //@ts-ignore
            setCurrentLongitude(intialRegion?.longitude);
        }
    }, [dailyLocation])

    useEffect(() => {
        console.log('location get data::::', data?.getMemberLocation && data?.getMemberLocation?.locations);
        if (data?.getMemberLocation?.locations !== undefined) {
            // total ideal time
            var idelTime = calculateAndConvertTotalIdelTime(data?.getMemberLocation?.locations);
            console.log('idel time::', idelTime);
            setTotalIdelTime({
                hrs: String((idelTime.hours).toFixed(0)),
                min: String((idelTime.minutes).toFixed(0)),
                sec: String((idelTime.seconds).toFixed(0))
            })

            // total teavelled time:--
            const startTime = data?.getMemberLocation?.locations[0]?.timestamp;
            const endTime = data?.getMemberLocation?.locations[data?.getMemberLocation?.locations.length - 1]?.timestamp;
            const timeDifference = calculateTimeDifference(startTime, endTime);
            setTotalTime({
                hrs: String((timeDifference.hours)?.toFixed(0)),
                min: String((timeDifference.minutes).toFixed(0)),
                sec: String((timeDifference.seconds).toFixed(0))
            });
            // const waypointChunks = chunkArray(data?.getMemberLocation?.locations, MAX_WAYPOINTS);
            const chunks = chunkArrayIntoMax20Arrays(data?.getMemberLocation?.locations);
            // console.log('waypointChunks:::::::::::', chunks)
            // 
            const destinationPoints = chunks.map((array, index) => {
                if (index === chunks.length - 1) {
                    return array[array.length - 1]; // Last item of the last array
                } else {
                    return array[0]; // First item of all other arrays
                }
            });
            //@ts-ignore
            setDailyLocation(destinationPoints);
            const { totalDistance } = calculateTotalDistance(chunks);
            console.log('total distance::', totalDistance);
            setTotalDistance(totalDistance?.toFixed(2))
        }
    }, [data])

    const pathCoordinates = dailyLocation.map((location: any) => ({
        lat: location.latitude,
        lng: location.longitude
    }));

    if(dailyLocation.length === 0) {
        return <div>Locations not available...</div>
    }


    return (
        <LoadScript googleMapsApiKey="AIzaSyA8fvaz-leRXM8RdB3tFJWmuExdWCI9USs">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                    {
                        //@ts-ignore
                        lat: dailyLocation[0]?.latitude || defaultCenter.lat,
                        //@ts-ignore
                        lng: dailyLocation[0]?.longitude || defaultCenter.lng
                    }
                }
                zoom={15}
            >
                {dailyLocation.map((location: any, index: number) => {
                    const markerTime = format(new Date(location?.timestamp), 'hh:mm:ss a');
                    return (
                        <Marker
                            key={index}
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title={`Updated at ${markerTime}`}
                        />
                    )
                })}
                <Polyline
                    path={pathCoordinates}
                    options={{
                        strokeColor: 'blue',
                        strokeOpacity: 1.0,
                        strokeWeight: 4,
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;

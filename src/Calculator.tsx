import styles from './Calculator.module.css'
import { useState, useEffect } from "react";
import {Button, Heading, Text} from "@radix-ui/themes";
import {
    GiBed,
    GiClothes,
    GiCoffeeMug,
    GiCycling,
    GiFriedEggs,
    GiMushroomHouse,
    GiSandwich,
    GiShower
} from "react-icons/gi";

const activities = {
    cuddleTime: {
        name: 'Cuddle time',
        icon: <GiBed size="60px" />,
        time: 15,
    },
    shower: {
        name: 'Shower',
        icon: <GiShower size="60px" />,
        time: 20,
    },
    getDressed: {
        name: 'Get dressed',
        icon: <GiClothes size="60px" />,
        time: 15,
    },
    breakfast: {
        name: 'Breakfast',
        icon: <GiFriedEggs size="60px" />,
        time: 20,
    },
    packLunch: {
        name: 'Pack lunch',
        icon: <GiSandwich size="60px" />,
        time: 15,
    },
    coffee: {
        name: 'Coffee',
        icon: <GiCoffeeMug size="60px" />,
        time: 15,
    },
    cycleToWork: {
        name: 'Cycle to work',
        icon: <GiCycling size="60px" />,
        time: 15,
    },
    orla: {
        name: 'At Orla`s',
        icon: <GiMushroomHouse size="60px" />,
        time: 10,
    }
}

type ActivityId = keyof typeof activities

export const Calculator = () => {
    const [selectedActivities, setSelectedActivities] = useState<ActivityId[]>(() => {
        const saved = localStorage.getItem('selectedActivities');
        return saved ? JSON.parse(saved) : ['coffee', 'cycleToWork', 'getDressed'];
    });
    
    const [startTime, setStartTime] = useState(() => {
        const saved = localStorage.getItem('startTime');
        return saved ? new Date(saved) : new Date('04/03/2025, 08:00:00');
    });

    useEffect(() => {
        localStorage.setItem('selectedActivities', JSON.stringify(selectedActivities));
    }, [selectedActivities]);

    useEffect(() => {
        localStorage.setItem('startTime', startTime.toISOString());
    }, [startTime]);

    const setStartMinutes = (minutes: number) => {
        const newDate = new Date(startTime)
        newDate.setMinutes(minutes)
        setStartTime(newDate)
    }

    const setStartHours = (hour: number) => {
        const newDate = new Date(startTime)
        newDate.setHours(hour)
        setStartTime(newDate)
    }

    const hourIsSelected = (hour: number) => {
        const currentHours = startTime.getHours()
        return hour === currentHours;
    }

    const minuteIsSelected = (minute: number) => {
        const currentMinutes = startTime.getMinutes()
        return minute === currentMinutes;
    }

    const getSelectedButtonVariant = (isSelected: boolean) => {
        return isSelected ? 'solid' : 'soft'
    }

    const selectActivity = (activityId: ActivityId) => {
        if (selectedActivities?.includes(activityId)) {
            setSelectedActivities(selectedActivities.filter(a => a !== activityId))
        } else {
            setSelectedActivities([...selectedActivities, activityId])
        }
    }

    const activityIsSelected = (activityId: ActivityId) => {
        return selectedActivities?.includes(activityId)
    }

    const calculateFinalTime = () => {
        const totalMinutes = selectedActivities.reduce((acc, activity) => acc + activities[activity]?.time, 0)
        const startDate = new Date(startTime);
        const hoursToSubtract = Math.floor(totalMinutes / 60);
        const minutesToSubtract = totalMinutes % 60;

        startDate.setHours(startDate.getHours() - hoursToSubtract);
        startDate.setMinutes(startDate.getMinutes() - minutesToSubtract);

        return startDate;
    }

    const finalTime = calculateFinalTime()

    const finalTimeMinus8Hours = () => {
        const finalTimeMinus8Hours = new Date(finalTime)
        finalTimeMinus8Hours.setHours(finalTimeMinus8Hours.getHours() - 8)
        return finalTimeMinus8Hours
    }
    return (
        <div className={styles.calculator}>
            <div className={styles.time}>
                <Text>When do you have to be at work?</Text>
                <Heading>{startTime.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</Heading>
                <div className={styles.timeButtons}>
                    <div className={styles.hours}>
                        {[6, 7, 8, 9].map(hour => 
                            <Button size="1" variant={getSelectedButtonVariant(hourIsSelected(hour))} onClick={() => setStartHours(hour)}>{String(hour).padStart(2, '0')}</Button>
                        )}
                    </div>
                    <Heading>:</Heading>
                    <div className={styles.minutes}>
                        {[0, 15, 30, 45].map(minute => 
                            <Button size="1" variant={getSelectedButtonVariant(minuteIsSelected(minute))} onClick={() => setStartMinutes(minute)}>{String(minute).padStart(2, '0')}</Button>
                        )}
                    </div>
                </div>

            </div>
            <div className={styles.activities}>
                <Text>What do you need to do in the morning?</Text>
                <div className={styles.activityButtons}>
                    {Object.entries(activities).map(([id, activity]) => (
                        <Button key={id} className={styles.activityButton} onClick={() => selectActivity(id as ActivityId)} variant={getSelectedButtonVariant(activityIsSelected(id as ActivityId))}>
                            {activity.icon}
                            <div className={styles.buttonText}>
                                <Text size="1" weight="bold">{activity.name}</Text>
                                <Text size="1">{`${activity.time} mins`}</Text>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
            <div className={styles.answer}>
                <Text>Alarm should be at</Text>
                <Heading>{finalTime.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</Heading>
            </div>
            <div className={styles.answer}>
                <Text>Sleep by</Text>
                <Heading>{finalTimeMinus8Hours().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</Heading>
                <Text>{`<3`}</Text>
            </div>
        </div>
    )
}
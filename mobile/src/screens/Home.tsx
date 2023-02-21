import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'

type SummaryProps  = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

const weekDays = ['D','S','T','Q','Q','S','S'];
const daysFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSizes = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSizes - daysFromYearStart.length

export function Home(){

    const { navigate } = useNavigation()
    const [ loading , setLoading ] = useState(true)
    const [ summary , setSummary ] = useState<SummaryProps | null >(null)


    async function fetchData(){
        try{

            setLoading(true)
            const response = await api.get('summary')
            setSummary(response.data)

        }catch(err){
            Alert.alert('Ops','Não foi possível carregar os dados de sumarização')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }


    useFocusEffect(useCallback(() => {
        fetchData()
      }, []))

    if(loading) {
        return (
            <Loading/>
        )
    }


    return (

        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>

            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((day, i)=>(
                        <Text
                            key={`${day}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{width: DAY_SIZE}}
                        >
                            {day}
                        </Text>
                    ))
                }
            </View>
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:100}}
            >
                {
                summary &&    
                <View className="flex-row flex-wrap">
                {
                    daysFromYearStart.map((date)=>{
                        
                        const dayWithHabits = summary.find(day => {
                            return dayjs(date).isSame(day.date, 'day')
                        })

                        return (
                            <HabitDay
                                key={date.toISOString()}
                                date={date}
                                amountOfHabits={dayWithHabits?.amount}
                                amountCompleted={dayWithHabits?.completed}
                                onPress={()=> navigate('habit', { date: date.toISOString() })}
                            />
                        )
                    })
                }
                {
                    amountOfDaysToFill > 0 && Array
                    .from({length: amountOfDaysToFill})
                    .map((_,i) =>(
                        <View
                            key={i}
                            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                            style={{width:DAY_SIZE, height: DAY_SIZE}}
                        />
                    ))
                }
                </View>
                }
            </ScrollView>
            
      

        </View>
    )

}
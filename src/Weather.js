import {useState,useEffect} from 'react'
import axios from 'axios'
import './index.css'
const api_key = '<password>'

const App =()=>{
  const [values,setValue] = useState('')
  const [country,setCountry] = useState({})
  //update simply triggering the rendering of app component
  const [update,setUpdate] = useState(null)

  // useEffect often used for triggers 
  useEffect(()=>{
    console.log('effect run, country is now', country)
    //only runs once currency is defined/everytime it changes
    if (update){
      console.log('fetching countries')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response=>{
          const filteredCountries = response.data.filter(country=>country.name.common.toLowerCase().includes(update.toLowerCase()))
          //doesn't correctly work, does not display japan only something else  
          // const countryNames = filteredCountries.map(country=>country.name.common)
          setCountry(filteredCountries)
          console.log('fetched')
        })
        .catch(()=>{
          setCountry({})
        })
    }
    else{
      setCountry({})
    }
  },[update])


  const handleChange = (event)=>{
    setValue(event.target.value)
    setUpdate(event.target.value)
  }

  const Weather = ({place})=>{
    const [coordinates,setCoordinates] = useState({lat:null,lon:null})
    const [temp,setTemp] = useState('')
    const[wind,setWind] = useState('')
    const [icon,setIcon] = useState('')

    useEffect(()=>{
      axios
        .get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${api_key}`)
        .then(response=>{
          const lat = response.data[0].lat
          const lon = response.data[0].lon
          setCoordinates({lat,lon}) 
    })
  },[place])

  useEffect (()=>{
    if(coordinates.lat!==null && coordinates.lon!==null){
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${api_key}`)
      .then(response=>{
        setTemp(response.data.main.temp)
        setWind(response.data.wind.speed)
        setIcon(response.data.weather[0].icon)
      })
    }
  },[coordinates])


return(
      <>
      <h2>{`Weather in ${place}`}</h2>
      <p>{`temperature ${(temp-273.15).toFixed(2)} Celsius / ${((temp-273.15)*(9/5)+32).toFixed(2)} Fahrenheit`}</p>
      {icon && <img src = {`https://openweathermap.org/img/wn/${icon}@2x.png`} alt = 'weather icon'/>}
      <p>{`wind ${wind} m/s`}</p>
    </>
    )}


    
const Display =({number})=>{
  console.log('running')
  const keyValues = Object.values(country[number].languages)

  return(
    <>
      <h1>
        {country[number].name.common}
      </h1>
      <p style = {{margin:'0px'}}>capital {country[number].capital}</p>
      <p style = {{margin:'0px'}}>area {country[number].area}</p>
      <h3>languages</h3>
      <ul>
        {keyValues.map((count,index)=><li key = {index}>{count}</li>)}
      </ul>
      <div style={{ margin: '20px' }}></div>
      <img src = {country[number].flags.png} alt = {`${country[number].name} flag`} style ={{height:'200px',width:'default'}}/>
      {/* <h2>{`Weather in ${country[number].capital}`}</h2> */}
      <Weather place = {country[number].capital}/>
    </>
  )
}

// 

const ShowView =()=>{
  const [selectedCountry,setSelectedCountry] = useState(null)

  const handleShowChange=(count)=>{
    setSelectedCountry(count)
  }
  return(
<>
  {country.map((count,index)=> 
  <p key = {index}>{count.name.common} <button onClick = {()=>handleShowChange(index)}>show</button></p>
  )}
  {selectedCountry!==null&&<Display number = {selectedCountry}/>}
</>
  )}


  return(
    <div>
      <form>
        find countries <input value = {values} onChange = {handleChange}/>
      </form>
      <ul style = {{listStyle: 'none', padding:0}}>
      {country.length>10?<p>Too many matches, specify another filter</p>:
      country.length>1?<ShowView/>
      :country.length===1? <Display number = {0}/>:
      (<p>No countries found</p>)}
      </ul>
    </div>
  )
//need to find way to only display name, common
//need to find way to display the right country 


}
export default App
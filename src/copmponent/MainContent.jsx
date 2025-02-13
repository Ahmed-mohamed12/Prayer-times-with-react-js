
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";

import "moment/dist/locale/ar-dz";
moment.locale("ar");
export default function MainContent() {
	// STATES
	const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
	const [timings, setTimings] = useState({
		Fajr: "04:27",
		Dhuhr: "11:50",
		Asr: "15:18",
		Sunset: "18:03",
		Isha: "19:33",
	});

	const [remainingTime, setRemainingTime] = useState("");

	const [selectedCity, setSelectedCity] = useState({
		displayName: "مكة المكرمة",
		apiName: "Makkah al Mukarramah",
	});

	const [today, setToday] = useState("");

	const avilableCities = [
		{
			displayName: "مكة المكرمة",
			apiName: "Makkah al Mukarramah",
		},
		{
			displayName: "الرياض",
			apiName: "Riyadh",
		},
		{
			displayName: "الدمام",
			apiName: "Dammam",
		},
	];

	const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];
	const getTimings = async () => {
		// console.log("Calling the API...");
		try {
		  const response = await axios.get(
			`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
			);
			// console.log(response);
			setTimings(response.data.data.timings);
		} catch (error) {
		  console.error("Error fetching timings:", error);
		  // You may want to add some error handling here, like displaying a message to the user
		}
	  };
	  
	  useEffect(() => {
		getTimings();
	  }, [selectedCity]);

	useEffect(() => {
		let interval = setInterval(() => {
			// console.log("calling timer");
			const t = moment();
			setToday(t.format("MMM Do YYYY | h:mm"));
			setupCountdownTimer();
		}, 1000);

		
		return () => {
			clearInterval(interval);
		};
	}, [timings]);
	
	

	const setupCountdownTimer = () => {
		const momentNow = moment();

		let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}

		setNextPrayerIndex(prayerIndex);

		// now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
		const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
		// console.log(remainingTime);

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
		
	};
	const handleCityChange = (event) => {
		const cityObject = avilableCities.find((city) => {
			return city.apiName == event.target.value;
		});
		// console.log("the new value is ", event.target.value);
		setSelectedCity(cityObject);
	};

	return (
		<>
			<Grid container={2} >
				<Grid xs={12} md={6} id="f">
					<div>
						<h2>{today}</h2>
						<h1>{selectedCity.displayName}</h1>
					</div>
				</Grid>
				<Grid xs={12} md={6} id="f">
					<div>
						<h2>متبقي حتي صلاه {prayersArray[nextPrayerIndex].displayName}</h2>
						<h1> {remainingTime}</h1>
					</div>
				</Grid>
			</Grid>


			{/*== TOP ROW ==*/}

			<Divider style={{ borderColor: "white", opacity: "0.1" }} />

			{/* PRAYERS CARDS */}

			<Stack style={{ marginTop: '50px' }}>
				<Grid container={2} columns={12} spacing={2}>
					<Grid xs={12} sm={6} md={4} lg  >
						<Prayer
							name="الفجر"
							time={timings.Fajr}
							// image="data:image/jpeg;base64,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"
						/>
					</Grid>
					<Grid xs={12} sm={6} md={4} lg  >
						<Prayer
							name="الضهر"
							time={timings.Dhuhr}
							// image="data:image/jpeg;base64,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"
						/>
					</Grid>
					<Grid xs={12} sm={6} md={4} lg  >
						<Prayer
							name="العصر"
							time={timings.Asr}
							// image="data:image/jpeg;base64,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"
						/>
					</Grid>
					<Grid xs={12} sm={6} md={4} lg  >
						<Prayer
							name="المغرب"
							time={timings.Sunset}
							// image="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAAAgEDBQQGB//EADwQAAEEAQMCBAQCCAMJAAAAAAEAAgMRBAUSIQYxE0FRYSJxgZEyUgcUI0KhsdHwM8HhFRYXQ1NiZLLS/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQG/8QAIREBAQEBAAIDAAIDAAAAAAAAAAERAhIhAzFBBFEFBhP/2gAMAwEAAhEDEQA/APB0FG1WUoXrcibVO2uU1Io1SYKyFG1WbVFLIrpTtTgI2lDVdFBCekEIarpRSspFIuq6RSekbUNJQRSkhFFXVlKRyFL2PYGlzS3cOLHdTSlznOrc4mhQsqLqstNqNpViFBVtrlRVq0pdqJpCOFFK2kUPRGldIoJqQQmDupFJ6UbVtxJSKToQ0lKKViAEwVkKA3hWbVFKYpKRSs2iktJgWlFJ6RSikpQQnpFIKyEUrCEbUFRCGtvhWUikFZZRpRSspRSKr2o2qykVygrIUUraUEIarpRStpRtQ120ik9IaQHAlu4DyPmtueqqRSt4JNdkECuFBVSKTUrYZXQP3sa0uoinCxygo7cKOE4YXHgKNvsi6ikpCdFIpK7pnsjpuwkmviBHn7J5Qzf+yvZ5bhykpDSbUbQnRSgrLfRTzVJ6UEIqukJ6RSYEpFJ6RSYK6TPduawbWja2uAiiilAlIop6TCNxjdIG/C00T6IKaUbCra5oopB10opOiltzLSKTUikCFqilZSilAnI7GlBB7pyhBXXoghes6J6Wh6jGacjLMAgaNgZVkm+SPQUvNSY+3LdjGRliQx7+ze9X8lNVbjaVl5On5WoRRH9Vxa8SQ8CyaoepXHS+sagdM/4baji6M8SQYu2N8gB+N+5pLve/VfKQCsy6thCEUkfe70UWfW15Ov5s578cfRfD/r/yfJ8M+Ty+5qykUmAsBH0Xsl2a+f7l56vN/CEdkzqJ4FIKZjC9wa0ck0FWdV0opWOaWkg8EcFLSLpaUEJ6RSmGqwPZBH92rKUUmBANpvujvzSekUmK62sc6w0EkC+FCYGrri1C1XNCFY1rS1259EduO6X6fVAtKEyEC0ik1IQEMksLi6GZ8biCCWuIJHop8LIkjdO6KV0Y/FKGkt+/Za3SmkM1nVxBMXDHiYZp65JY3yHzul73Sup8HUun9ahbppwsLDxjs3EEPBBAFUKdYHHusddZ6jWPM9LP8ToPqjHPO0NlA+3/AMrH03Qv1np3VNWkc4NxNrYwK+Iki7+hXd0i/boXVMTv3tN3Ae43f1C1elKm6A6ix/yHfX0B/wAlPcXNfPpIrtRHCTyStzSOm9U1jByMvAg8SKDgjdRce5DfUq7Wel9R0GHHl1BjNk/Z0bt211XtPAo9/wCq59fD8d78v17uP8l/J4+D/jOvTLxtNzMqCeeDHkkigrxXMF7L7X9lQIR5k/RfRP0T50bMvN0+QC8hokjJ/eLe7fsf4FN170g3FEuraZGGwjnIgaPw/wDePb1Hl3XTyy5XgzZr52MZ0kjI4QXSPcGtb6kmgFpdV6J/sDWDgxyOk2xMeXurlxHNe13SnQnbNd013/lRf+4Xo/0rRbepIngcPxm/wc5at9pPp4IjlCukj/KqqVQtIpPQQQKVUiFY5rPDFXvvn0pJSKVFJ6UUg6qCjampFKsFI5UEKwNJPAJ48haUNLttAmzxXn8lAqKTVyR5jyQ4V2I+qBQOfZaeidPanrchbgYznRg06Z/wxt+vn8hyqocZuJmYh1fGnGLJUhbt2mSP1b6jsvpTtX6d1nEh0/B1mbS2tGxsMQ8Iu/h/msddY3zNc2i6RpXRMrs/VtYjOU6Ms8JpqweaDe7jwF35WX0z1bpww49UbitLxI6EObC8u8tzT35+ax8j9GPikyY2rueXc3LHZP1BWHrfQWbpGHLlZObheBGLJc4sJ9gK5JWPVa2xra3p2idKaHqEWHmnJzdQj8Boc9pIbfJoeX9QuPoF4donUuOeS7Ec+vX4SvEtaGimgN+XC9b+j+Ta7W2fn06T+AP9VrMjO7Wf09r+r6bhy4GnPJbkGmsDdzg4irb7o1zWdU1JsONqrzuxuNhZtdfa3e/H812dGMZiTu1vLa44mntDyGjlzjwAP4r0vXEem6908zX9Oe10kLwxzgKJaSAWuHqOElmmWx8/w8qbDyocjGkLJYn7mEeq93ofXc2brDYdUbE3DyA2HYOdrjxfPkTwfmvAbbRW23c8LXXOpLjb1LSzpXWUWEwHYMyIxeoaXgj+/Zb/AOluGs/T5R+9G9t/IhO6E6111pUwHwxYkGRkO9KBP81PW87dd6XwNZx2/smTSBzvRpJAJ+wWN9xqT1Xz6lzyNp3C6TXl2WjgdP5uqY2bNiMDv1SJshYOXP3XTR70D9vddLcYnthoNWvZYPS+m6VBHmdX5gx3PG6PBjP7Rw91uaXqvQ+ZNHprdLbAJ3iON80YG5x4Au7BJWfP+m5y+YoW31fpcGj9QZOFiuuBtOaCbLbF7b9ljUtJfRUUE1KCER1UopWUpDRTie60y9F0JrmBoWdlSahE8iaMNZI0bttdxXvx9lXoGtafgdVyapPi1jOL/Dawcwl3ZwHyv7rz9BTt9DSxYutHqnPxtU1vJzMKLw4XkUNtE+5HusocEGgaN0Vv6Z0pqOq4gydP/V5h5s8UBzD7ha+n/o8z3P8AF1XIhxcdvLy1251efspskMtr0+R1Bo2R01p+p61hxyRz/CIjCJNrxYNA/IrCm6803AY5vT+jRQuPG8xtjH2bysDqzUsXMyIMHTG7dNwW+HBXZx83e/zWPhYeRn5ceLjRmWaQ01o8/wDRScb7rV6/I0NV6o1vUz+31CaNh/5UDjG3+Hf6lZEsksu1000sjm9i95dXyvsr87DyMDKfi5cTo5mfiaVRS3MY2/pK5WpoGczThqErw4ibDkgbQ/ecAP6rgbY3WwGxXPkp2uDaNgHmvVWrr1nRHUOnaRhZWJqkJfHM4OsRh4PFUQqeq+qGatBHgadjtxtPY7cW7Q0vPlwOAF51sfFEG0eH3oWseMXWlhdO6jqGGMnTomZTOzmxSDcw+hBpdeD0ZruXMI34bsZp4c+ZwAA+ndY2Nl5WFOZsSeWCQfvxktIWvP1d1BND4T9Tka08EtY1p7eoCW9Exta7Jh9K6LLo2nymXPyxWTN5tb6e3y+azuj+q26HDJhZkLpsKR1gNolh8+D5ey824OJJduLieS7uT/ml2/6+yZM9pbdfQXdRdDk2dHjJPn+pNCpl6+wMDIih0XTGMwQSZWtYIySfNoHn814PZxuo1dX5JHMcappN9uO6eMXyr6LkdT9FajIcnP03fkEcudi24+Xcd1xzdaaHpjXO6d0OJk7hQmdE1n3Pc/JeEki2beeHC+yWknEW91OVNNl5EmTkvL5ZHFz3HzKrDbPl9U1I2rUmM6Jotjq47eRSUrHCzajaqOilNcJtjtu6uPVQEQtKFZSWkD488+LJ4mNNJC/80bi0roytW1PLh8LKz8mWP8j5CR/NcqFMlX2QCl26PqeRo+fHm4gYZGWKeLDh5hclKfh2Vt+K/wAV+Sv5hjs1vVJ9a1KTOymta94ADWdmgCqCz6VlKKUkxMraMzpOnoMWOLKYYgZHBgHhSt3fid52LpX6tkP1LSsTTo8SZk2OBHfB3kM5+vyWS2aRkRDZXhjhtLb8vT+akZmSH72zvD73WPXtamK2c/NZm63i6icPIOOxjXmOhzt545PHb+il2pn/AHiZqEeNNCZGNfLCHCydvJHbjsViDInAAErqa0saL7D0UtyZw6/FN0Bz3IAoD7EqYrtxzkfqOoQGHIklzRE9jmgHhr7JPn51wrMzJm1DR8LGgxXmbe0SSAf4rvwxgfQlZ4zMlm3bM8FrdoINfD6f36JG5eQz8Mzm/E1/Hk5vYj0IVwbudlOn1bTstuFkBmK39pGWf9P8dfF7ey4WMzJp8t8mNJ4uTC2NoiBIva0t7kn8Iv1XGNRywQf1mSxu53fmNu+6qbmZEbgY5ntIINg+g2j+HCmI65RLkYeDhxx5Qmcw+HC1o2S25x3d7vv5eXdd2NkyxappuT4OS5+Oza+mN+MGw0BpcWj8LgTx8uFhjMym+GWzPBiG1hDvwj+yUMy8lmzbO8bK20e1XX23O+5VwdvUGXLmnCdJE9nh4+0Oe0Dd8RJqvIdr78LIA5V800s7WNlkc4RimA/ujvSrVkxPtG1RtTIVCFqilZ3RSC7k8Wa70oIpTSKU/QqmrTUilVJSdsbj5KbLpNzu5XU2gBSzo4nNI8lFH0XY9nqlDQBwE0ctIpdO0eYSOZXZNCtAU0obx3Uq6BQmUEporcVCY8qKQLSKTUikKhzCGg1d9koCalNJAlKaTkD1CVULSKTBBQLSKUqUFoaSTVED3RSO5soWVClteaVCIPPhXRvIVPkrGjgKVVjnFx5TsbfkT8kjR91vYWOyGNpoFxHJ9Vz668Y3xx5MSQNqh3VYB8ha3c/HjkiLw0Nc0WCPNYjr22nHXkd8eKh45Sqxx8+65n5EbJmxOcA53YFdWFqOVIHqhELSEyFVKLDgfRDuST6plCaFpRSdFJqEr2CKT0ikCUmLPhB8ippCKWlHKdFIJ3IK435f5G/dUvke/lzvoFBpAgoXBHI+Pz49F0MyGn8RpMTV57J2fhCrDg4cG07VFWNNDjutfEz2GMMk4c0Usa0kmRFD/iODb9VjrnW+e/Fs5uc0x+HHy4/YLMedos9vRZr9SqSo22PWk8mX4sfz8lrnjxTvvy+1eZqAYwiMWTxaw55HSu3kkOu7XZlta4FzOzVwLST21MTV+zMhvtuC1Wua9ocw209ivKOHyV+LnTYvDHbm+hRby9KpBp3awsNmsy+IC5rSw9xXK1YMuHIoRPBNXSJi9QhCIEIQgEJXysj5cuaTKvhjfqro67UrMc9zjy+07J5GfvWPRB3oXOMxvAe2irG5EVcuQZtqQqw9p7FSHD1VSrrUWqt/uoMteag6GyFvburP17Zw+vos58x/dKoe4nzQakurNbxG2/crilzBM4ueeVwm1FqNyOozhPHlW3a4gBcNhMrp4x1zztLNreb44XJai0riosmJJUJbRamtpTxSmGRr2kgg+SrtQiNrH1nc8NnYA38wWgM3Fd+GZnPYWvK2i+R3FImPUyZbG8N+Jc8mTI/sdo9FlY+WRxJyPVdTZQexVjnZVxN9+6CVV4gR4gVkZWAqbVXiAqQ4FFPaFFilG4eqK//Z"
						/>
					</Grid>
					<Grid xs={12} sm={6} md={4} lg  >
						<Prayer
							name="العشاء"
							time={timings.Isha}
							// image="data:image/jpeg;base64,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"
						/>
					</Grid>
				</Grid>
			</Stack>


			{/*== PRAYERS CARDS ==*/}

			{/* SELECT CITY */}
			<Stack direction="row" justifyContent={'space-around'} style={{ marginTop: '50px', marginBottom: '50px' }}>
				<FormControl style={{ width: '20%' }}>
					<InputLabel id="demo-simple-select-label">المدينه</InputLabel>
					<Select
						style={{ color: "white", minWidth:"15rem"}}
						labelId="demo-simple-select-autowidth-label"
						id="demo-simple-select-autowidth"

						onChange={handleCityChange}
						autoWidth
						label="Age"
						value={selectedCity.displayName}
					>
						{/* <MenuItem > */}
						{/* <em>None</em> */}
						{/* </MenuItem> */}
						{avilableCities.map((city, index) => {
							return (
								<MenuItem key={index} value={city.apiName}> {city.displayName}</MenuItem>
							)
						})}

					</Select>
				</FormControl>
			</Stack>
		</>
	);
}
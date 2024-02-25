import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';


export default function WeatherGraph({ displayedGraphInfo, weatherData, detailedForecastDay }) {
  return (
    <>
      {displayedGraphInfo === "Temp" ? (
        <ResponsiveContainer key={detailedForecastDay} width="100%" height="100%">
          <AreaChart
            width={500}
            height={300}
            data={weatherData.forecast.forecastday[detailedForecastDay].hour}
            margin={{
              top: 50,
              right: 0,
              left: -0,
              bottom: 20,
            }}
            className="text-sm" // Add CSS class for font styling
          >
            <CartesianGrid strokeDasharray="12 12" stroke="#1f2937" vertical={false} />
            <XAxis
              dy={10}
              dataKey="time"
              tickFormatter={(time, index) => {
                const date = new Date(time);
                const hour = date.getHours();
                const minute = date.getMinutes();
                if (hour === 0 && minute === 0 && index !== 0) {
                  return "";
                }
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                });
              }}
              interval={2}
              axisLine={false} // Remove outer line on x-axis
              tick={{ fill: "#9ca3af" }}
            />
            <YAxis reversed={false} dx={-10} interval={0} axisLine={false} tick={{ fill: "#9ca3af" }} /* tickFormatter={(label) => ``} */ tickFormatter={(label) => `${label}°C`} />
            <Tooltip
              contentStyle={{
                color: "#ffffff",
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.375rem", // Add rounded-md corners
              }}
              formatter={(value) => `${Math.round(value)}°C`}
              labelFormatter={(value) => `${new Date(value).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })}`}
              interval={2}
            />
            <Area
              type="monotone"
              dataKey="temp_c"
              name="Temperature" // Set the name of the data key to "Temperature"
              stroke="#3b82f6"
              fill="#2563eb"
              baseValue={Math.min(0, weatherData.forecast.forecastday[detailedForecastDay]?.day?.mintemp_c)}
            />
          </AreaChart>
        </ResponsiveContainer>)
        :
        (<ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={300}
          data={weatherData.forecast.forecastday[detailedForecastDay].hour}
          margin={{
            top: 50,
            right: 0,
            left: 10,
            bottom: 20,
          }}
          className="text-sm" // Add CSS class for font styling
        >
          <CartesianGrid strokeDasharray="12 12" stroke="#1f2937" vertical={false} />
          <XAxis
            dy={10}
            dataKey="time"
            tickFormatter={(time, index) => {
              const date = new Date(time);
              const hour = date.getHours();
              const minute = date.getMinutes();
              if (hour === 0 && minute === 0 && index !== 0) {
                return "";
              }
              return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              });
            }}
            interval={2}
            axisLine={false} // Remove outer line on x-axis
            tick={{ fill: "#9ca3af" }}
          />
          <YAxis reversed={false} dx={-10} interval={0} axisLine={false} tick={{ fill: "#9ca3af" }} /* tickFormatter={(label) => ``} */ tickFormatter={(label) => `${label}mm`} />
          <Tooltip
            contentStyle={{
              color: "#ffffff",
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "0.375rem", // Add rounded-md corners
            }}
            formatter={(value) => `${value}mm`}
            labelFormatter={(value) => `${new Date(value).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            })}`}
            interval={2}
          />
          <Area
            type="monotone"
            dataKey="precip_mm"
            name="Precipitation" // Set the name of the data key to "Temperature"
            stroke="#3b82f6"
            fill="#2563eb"
            baseValue={Math.min(0, weatherData.forecast.forecastday[detailedForecastDay]?.day?.precip_mm)}
          />
        </AreaChart>
      </ResponsiveContainer>)
      }
    </>
  );
}
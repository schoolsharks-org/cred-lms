import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
  } from "recharts";
  
  const BarGraph = ({ data }: { data: any }) => {
  
    if(!data){
      return null;
    }
    
    const formattedData = Object.entries(data).map(([key, value]: any) => ({
      name: key,
      a: value.OptionA,
      b: value.OptionB,
    }));
  
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={formattedData}
          margin={{
            top: 5,
            right: 10,
            left: -42,
            bottom: 36,
          }}
          barGap={0}
          barCategoryGap={"20%"}
        >
          <XAxis dataKey="name" fontWeight={"600"} fontSize={"1.25rem"} style={{fontFamily:"Inter",color:"#000"}} />
          <YAxis tick={false} />
          <Tooltip />
          <Bar dataKey="a" fill="#D53951">
            <LabelList
              dataKey="a"
              fontSize={"12px"}
              color="#000"
              position="top"
              formatter={(value: any) => `${value}%`}
            />
          </Bar>
          <Bar dataKey="b" fill="#000000">
            <LabelList
              dataKey="b"
              fontSize={"12px"}
              color="#000"
              position="top"
              formatter={(value: any) => `${value}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default BarGraph;
  
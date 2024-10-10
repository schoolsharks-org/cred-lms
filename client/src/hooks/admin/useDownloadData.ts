import adminApi from "@/api/adminApi";

const downloadBlobFile = (blob: Blob, fileName: string) => {
  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const useDownloadData = () => {


  const fetchData = async ({path,name}:{path:string,name:string}) => {
    const response = await adminApi.get(path, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    downloadBlobFile(blob, `${name}_${Date.now()}.xlsx`);
  };


  const handleDownload = async (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, "");
    console.log(key)

    if (key === "totalno.ofemployees") {
      await fetchData({path:"/download-totalEmployees",name:"employees"});
    }
    if (key === "inactivelast7days") {
      await fetchData({path:"/download-inactiveLast7Days",name:"inactiveLast7Days"});
    }
    if (key === "inactivelast15days") {
      await fetchData({path:"/download-inactiveLast15Days",name:"inactiveLast15Days"});
    }
    if (key === "no.ofweeklymodules") {
      await fetchData({path:"/download-weeklyModules",name:"weeklyModules"});
    }
    if (key === "modulescompleted") {
      await fetchData({path:"/download-modulesCompleted",name:"modulesCompleted"});
    }
    if (key === "below80%") {
      await fetchData({path:"/download-below80Scorers",name:"below80%Scorers"});
    }
    if (key === "reattempted") {
      await fetchData({path:"/download-reattempted",name:"reattempted"});
    }
    if (key === ">80%afterreattempt") {
      await fetchData({path:"/download-progressReattempt",name:"progressReattempt"});
    }
  };

  return { handleDownload };
};

export default useDownloadData;

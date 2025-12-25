import { StepBar } from "./StepBar";

interface Props {
    row: {
      company: string;
      OTD: string;
      IID: string | null;
      RID: string | null;
    };
  }
  
export function OTCard({ row}: Props) {
    
    return (
      <div className="flex justify-between  bg-white rounded-xl shadow p-4 text-black">
        <div className="flex justify-between items-center mb-2 mr-16">
          <div>
            <h2 className="font-semibold text-lg">{row.company}</h2>
            <p className="text-sm text-gray-500">{row.OTD}</p>
          </div>
        </div>
  
        <StepBar OTD={row.OTD} IID={row.IID} RID={row.RID} />
      </div>
    );
  }
  
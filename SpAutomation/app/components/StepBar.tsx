export function StepBar({
  OTD,
  IID,
  RID,
}: {
  OTD: string;
  IID: string | null;
  RID: string | null;
}) {
  const steps = [
    { label: "QT", done: true, id: OTD },
    { label: "IN", done: Boolean(IID), id: IID },
    { label: "RE", done: Boolean(RID), id: RID },
  ];

  return (
    <div className="flex items-center">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex items-center">
          {/* STEP */}
          <div className="relative group flex flex-col items-center">
            {/* Circle */}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center
                  text-sm font-bold cursor-default
                  ${
                    step.done
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
            >
              {step.label}
            </div>

            {/* Tooltip (อ้างอิงเฉพาะวงกลมนี้) */}
            {step.done && step.id && (
              <div
                className="
                    absolute -top-12 left-1/2 -translate-x-1/2
                    whitespace-nowrap
                    bg-gray-900 text-white text-xs
                    px-3 py-1.5 rounded
                    opacity-0 group-hover:opacity-100
                    transition pointer-events-none z-10
                  "
              >
                <div className="font-semibold">{step.id}</div>

                {/* Arrow */}
                <div
                  className="
                      absolute top-full left-1/2 -translate-x-1/2
                      w-2 h-2 bg-gray-900 rotate-45
                    "
                />
              </div>
            )}
          </div>

          {/* LINE (อยู่นอก group) */}
          {idx < steps.length - 1 && (
            <div className="w-32 h-1 bg-gray-300 mx-4 rounded" />
          )}
        </div>
      ))}
    </div>
  );
}

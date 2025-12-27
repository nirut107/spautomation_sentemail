export function EmailThread({ messages }: { messages: any[] }) {
  const MY_EMAILS = "atipanyo107@gmail.com";
  let sorted;
  try {
    sorted = [...messages].sort(
      (a, b) => Number(a.internalDate) - Number(b.internalDate)
    );
  } catch {
    sorted = [];
  }

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4">
      {sorted.length != 0 ? (
        sorted.map((msg, idx) => {
          const fromMe = msg.from?.toLowerCase().includes(MY_EMAILS);
          console.log(msg);

          return (
            <div
              key={idx}
              className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[100%] rounded-xl px-4 py-3 text-sm shadow
                  ${
                    fromMe ? "bg-blue-600 text-white" : "bg-white text-gray-900"
                  }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {fromMe ? "You" : msg.from}
                </div>

                {msg.body.type === "text/html" ? (
                  <div
                    className="
                  prose max-w-none
                  overflow-x-auto
                  break-words
                  [&_*]:max-w-full
                  [&_img]:max-w-full
                  [&_img]:h-auto
                  [&_table]:max-w-full
                  [&_table]:block
                "
                    dangerouslySetInnerHTML={{ __html: msg.body.content }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm">
                    {msg.body.content}
                  </pre>
                )}

                <div className="text-[10px] opacity-60 text-right mt-2">
                  {new Date(msg.date).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="mt-40 text-black whitespace-pre-wrap text-lg">
          This Email have deleted!
        </div>
      )}
    </div>
  );
}

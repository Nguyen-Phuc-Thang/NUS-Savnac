import Timer from "@/components/timer";

const Pomodoro = () => {
  return (
    <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6 items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Pomodoro Timer</h1>
      <Timer />
    </div>
  );
};

export default Pomodoro;

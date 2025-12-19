interface SessionIndicatorProps {
  session: 'Asia' | 'London' | 'New York' | 'Overlap';
}

export default function SessionIndicator({ session }: SessionIndicatorProps) {
  const sessionColors = {
    'Asia': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'London': 'bg-blue-100 text-blue-800 border-blue-300',
    'New York': 'bg-green-100 text-green-800 border-green-300',
    'Overlap': 'bg-purple-100 text-purple-800 border-purple-300'
  };

  const sessionIcons = {
    'Asia': '🌅',
    'London': '🇬🇧',
    'New York': '🗽',
    'Overlap': '🔥'
  };

  const sessionTimes = {
    'Asia': '23:00 - 08:00 UTC',
    'London': '07:00 - 16:00 UTC',
    'New York': '12:00 - 21:00 UTC',
    'Overlap': 'Londres + NY'
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-semibold text-sm ${sessionColors[session]}`}>
      <span>{sessionIcons[session]}</span>
      <span>{session}</span>
      <span className="text-xs opacity-75">({sessionTimes[session]})</span>
    </div>
  );
}

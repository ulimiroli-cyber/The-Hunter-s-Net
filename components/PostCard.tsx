'use client';
import { formatDistanceToNow } from 'date-fns';

type PostProps = {
  post: any; // Idealmente definir la interfaz exacta
};

export default function PostCard({ post }: PostProps) {
  return (
    <article className="border border-terminal-green p-4 mb-6 bg-black relative">
      {/* Esquinas decorativas retro */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-terminal-green"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-terminal-green"></div>
      
      <div className="flex justify-between items-start mb-2 border-b border-dashed border-dark-gray pb-2">
        <div>
          <span className="font-bold text-lg">@{post.profiles.username}</span>
          <span className="text-xs ml-2 text-gray-500">
            {formatDistanceToNow(new Date(post.created_at))} ago
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs border border-terminal-green px-1 inline-block bg-dark-gray">
            {post.location}
          </div>
          <div className={`text-xs mt-1 uppercase ${post.danger_level === 'Alto' ? 'text-blood-red font-bold animate-pulse' : 'text-terminal-green'}`}>
            LVL: {post.danger_level}
          </div>
        </div>
      </div>

      <p className="my-4 text-bone-white text-lg leading-tight whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="text-sm mb-4">
        <span className="text-gray-500">TARGET_CLASS:</span> <span className="border-b border-terminal-green">{post.creature_tag}</span>
      </div>

      {/* ASCII Divider */}
      <div className="text-center text-dark-gray mb-2">
        ----------------------------------------
      </div>

      <div className="flex gap-4 text-lg">
        <button className="hover:-translate-y-1 transition-transform" title="Salt it">🧂 0</button>
        <button className="hover:-translate-y-1 transition-transform" title="Burn it">🔥 0</button>
        <button className="hover:-translate-y-1 transition-transform" title="Exorcise">📖 0</button>
        <button className="hover:-translate-y-1 transition-transform" title="Bullshit">❌ 0</button>
        <button className="hover:-translate-y-1 transition-transform" title="Need Backup">🆘 0</button>
      </div>
    </article>
  );
}
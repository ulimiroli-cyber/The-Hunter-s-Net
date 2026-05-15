'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Skull, Flame, Crosshair, Image as ImageIcon, X, Loader2, Camera, Edit3, Check, Trash2, MessageSquare, ChevronDown, ChevronUp, LogOut, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Pre-computed static values to avoid SSR/CSR floating point mismatch
const RUNE_RING1 = [0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
  const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ']
  const rad = (deg * Math.PI) / 180
  return { x: parseFloat((200 + 170 * Math.cos(rad)).toFixed(4)), y: parseFloat((200 + 170 * Math.sin(rad)).toFixed(4)), rune: runes[i] }
})
const PENTAGRAM_LINES = [0,1,2,3,4].map(i => {
  const a1 = (i * 72 - 90) * Math.PI / 180
  const a2 = ((i * 72 + 144) - 90) * Math.PI / 180
  return {
    x1: parseFloat((200 + 150 * Math.cos(a1)).toFixed(4)),
    y1: parseFloat((200 + 150 * Math.sin(a1)).toFixed(4)),
    x2: parseFloat((200 + 150 * Math.cos(a2)).toFixed(4)),
    y2: parseFloat((200 + 150 * Math.sin(a2)).toFixed(4)),
  }
})
const RUNE_RING2 = [15,45,75,105,135,165,195,225,255,285,315,345].map((deg, i) => {
  const runes = ['ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ']
  const rad = (deg * Math.PI) / 180
  return { x: parseFloat((200 + 165 * Math.cos(rad)).toFixed(4)), y: parseFloat((200 + 165 * Math.sin(rad)).toFixed(4)), rune: runes[i] }
})
const RUNE_RING3 = [0,60,120,180,240,300].map((deg, i) => {
  const runes = ['☽','☿','♄','♃','♂','♀']
  const rad = (deg * Math.PI) / 180
  return { x: parseFloat((200 + 175 * Math.cos(rad)).toFixed(4)), y: parseFloat((200 + 175 * Math.sin(rad)).toFixed(4)), rune: runes[i] }
})
const EYES = [
  {top:'12%',left:'8%',delay:'0s',dur:'5s',size:'5px'},{top:'28%',left:'92%',delay:'1.5s',dur:'7s',size:'7px'},
  {top:'55%',left:'4%',delay:'2.8s',dur:'6s',size:'4px'},{top:'72%',left:'88%',delay:'0.7s',dur:'8s',size:'6px'},
  {top:'85%',left:'15%',delay:'3.2s',dur:'5.5s',size:'5px'},{top:'18%',left:'78%',delay:'4s',dur:'6.5s',size:'4px'},
  {top:'40%',left:'96%',delay:'1s',dur:'7.5s',size:'6px'},{top:'65%',left:'2%',delay:'2s',dur:'5s',size:'5px'},
  {top:'90%',left:'60%',delay:'3.5s',dur:'8s',size:'4px'},{top:'5%',left:'45%',delay:'0.5s',dur:'6s',size:'7px'},
  {top:'78%',left:'42%',delay:'2.3s',dur:'7s',size:'5px'},{top:'33%',left:'6%',delay:'1.8s',dur:'5.5s',size:'4px'},
]

function SupernaturalBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return (
    <div className="spn-bg-canvas" aria-hidden="true">
      <div className="spn-moon" />
      <svg className="spn-summon-ring" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.38}}>
        <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(220,30,50,1)" strokeWidth="1.8" strokeDasharray="6 4"/>
        <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(220,150,0,0.8)" strokeWidth="1"/>
        {RUNE_RING1.map((r, i) => (
          <text key={i} x={r.x} y={r.y} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="rgba(255,60,60,1)" fontFamily="serif">{r.rune}</text>
        ))}
        {PENTAGRAM_LINES.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(220,30,50,0.9)" strokeWidth="1.2"/>
        ))}
      </svg>
      <svg className="spn-summon-ring-inner" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.32}}>
        <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(42,200,160,1)" strokeWidth="1.4" strokeDasharray="3 6"/>
        <circle cx="200" cy="200" r="178" fill="none" stroke="rgba(42,200,160,0.5)" strokeWidth="0.8"/>
        {RUNE_RING2.map((r, i) => (
          <text key={i} x={r.x} y={r.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="rgba(60,220,180,1)" fontFamily="serif">{r.rune}</text>
        ))}
      </svg>
      <svg className="spn-summon-ring-3" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.22}}>
        <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(220,200,140,0.9)" strokeWidth="1" strokeDasharray="2 8"/>
        {RUNE_RING3.map((r, i) => (
          <text key={i} x={r.x} y={r.y} textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="rgba(220,200,140,1)" fontFamily="serif">{r.rune}</text>
        ))}
      </svg>
      {EYES.map((eye, i) => (
        <div key={i} className="spn-eye" style={{
          top: eye.top, left: eye.left,
          '--eye-dur': eye.dur, '--eye-delay': eye.delay, '--eye-size': eye.size
        } as any}/>
      ))}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  // Memoized so the same instance is used for queries, Realtime and auth
  // (creating a new client on every render broke the Realtime subscription)
  const supabase = useMemo(() => createClient(), [])

  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [editingName, setEditingName] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Bio editing
  const [editingBio, setEditingBio] = useState(false)
  const [newBio, setNewBio] = useState('')
  const [savingBio, setSavingBio] = useState(false)

  // User reactions: postId -> reactionType (emoji)
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  // Post reaction counts: postId -> { emoji: count }
  const [postReactionCounts, setPostReactionCounts] = useState<Record<string, Record<string, number>>>({})
  // Which post has the reaction picker open
  const [openReactionPicker, setOpenReactionPicker] = useState<string | null>(null)
  // Keep likedPosts for compat with realtime check
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  // ref para evitar que el canal realtime pise el estado optimista
  const pendingLike = useRef<Set<string>>(new Set())
  // ref del usuario actual para callbacks de Realtime
  const currentUserRef = useRef<any>(null)

  // REACTION_MAP: usamos un ID corto como reaction_type en la DB para evitar
  // problemas de encoding Unicode con emojis compuestos (ej: 👁️ tiene U+FE0F)
  const REACTIONS = [
    { id: 'fire',    emoji: '🔥', label: 'Carry on' },
    { id: 'salt',    emoji: '🧂', label: 'Trae la sal' },
    { id: 'scream',  emoji: '😱', label: 'Idjits' },
    { id: 'grin',    emoji: '😀', label: 'Dean approved' },
    { id: 'astonish',emoji: '😲', label: 'What the hell' },
    { id: 'search',  emoji: '🔎', label: 'Investigando' },
    { id: 'sleepy',  emoji: '😪', label: 'Larga noche' },
    { id: 'shush',   emoji: '🤫', label: 'Silencio sobrenatural' },
    { id: 'mask',    emoji: '😷', label: 'Monstruo repugnante' },
    { id: 'hurt',    emoji: '🤕', label: 'Batalla dura' },
    { id: 'sick',    emoji: '🤢', label: 'Caso asqueroso' },
    { id: 'skull',   emoji: '💀', label: 'Muerte confirmada' },
    { id: 'rage',    emoji: '😡', label: 'Coraje de cazador' },
    { id: 'mask2',   emoji: '🎭', label: 'Engaño demoniaco' },
    { id: 'paw',     emoji: '🐾', label: 'Rastro sobrenatural' },
    { id: 'demon',   emoji: '😈', label: 'Crowley vibes' },
    { id: 'think',   emoji: '🤔', label: 'Caso extraño' },
    { id: 'laugh',   emoji: '😂', label: 'Classic Dean' },
    { id: 'fear',    emoji: '😨', label: 'Terror puro' },
    { id: 'moon',    emoji: '🌕', label: 'Luna llena' },
    { id: 'ghost',   emoji: '👻', label: 'Aparición confirmada' },
    { id: 'eye',     emoji: '👁️', label: 'Te están vigilando' },
    { id: 'torch',   emoji: '🔦', label: 'En la oscuridad' },
    { id: 'tape',    emoji: '📼', label: 'Evidencia grabada' },
    { id: 'radio',   emoji: '📻', label: 'Frecuencia abierta' },
    { id: 'clown',   emoji: '🤡', label: 'Payaso del infierno' },
  ]

  // helpers para convertir entre ID y emoji
  const idToEmoji = (id: string) => REACTIONS.find(r => r.id === id)?.emoji ?? id
  const emojiToId = (emoji: string) => REACTIONS.find(r => r.emoji === emoji)?.id ?? emoji

  // Helper: total de reacciones de un post sumando todos los emojis
  const getTotalReactions = (postId: string): number => {
    const counts = postReactionCounts[postId]
    if (!counts) return 0
    return Object.values(counts).reduce((a, b) => a + b, 0)
  }

  // Fondo del post: negro oscuro que se tiñe de rojo con las reacciones — MODO DEMONIO
  const getPostBloodStyle = (count: number): React.CSSProperties => {
    if (!count || count <= 0) {
      return {
        background: 'linear-gradient(160deg, rgba(10,12,20,0.97) 0%, rgba(8,9,16,0.97) 100%)',
      }
    }
    // Escala: 1 reacción ya empieza a teñirse, 50+ = modo demonio máximo
    const clamped = Math.min(count, 50)
    const t = clamped / 50
    // Rojo que va de casi negro a carmesí profundo
    const r1 = Math.round(10 + t * 140)
    const r2 = Math.round(8 + t * 100)
    const g1 = Math.round(t < 0.5 ? 0 : 0)
    const b1 = Math.round(20 - t * 20)
    // Glow y borde que se intensifican
    const glowR = Math.round(60 + t * 180)
    const glowStr = Math.round(6 + t * 40)
    const glowOpacity = parseFloat((0.06 + t * 0.45).toFixed(2))
    const borderR = Math.round(80 + t * 175)
    const borderOpacity = parseFloat((0.35 + t * 0.65).toFixed(2))
    // En modo demonio alto (t > 0.7) añadimos un pulso extra naranja/sangre en el gradiente
    const demonOverlay = t > 0.7
      ? `, rgba(${Math.round(80 + t * 60)},${Math.round(t * 8)},0,${parseFloat((t * 0.18).toFixed(2))})`
      : ''
    return {
      background: `linear-gradient(160deg, rgba(${r1},${g1},${b1},0.97) 0%${demonOverlay ? `, rgba(${Math.round(r1 * 0.6)},0,0,0.97) 50%` : ''}, rgba(${r2},0,0,0.97) 100%)`,
      borderLeftColor: `rgba(${borderR},0,0,${borderOpacity})`,
      boxShadow: `-2px 0 ${glowStr}px rgba(${glowR},0,0,${glowOpacity})${t > 0.5 ? `, inset 0 0 ${Math.round(t * 20)}px rgba(${glowR},0,0,${parseFloat((t * 0.08).toFixed(2))})` : ''}`,
    }
  }

  // Drops de sangre para posts con 100+ avistamientos
  const BLOOD_DROPS = [3,8,14,20,27,35,43,51,59,67,75,83,91,97]

  // Follows
  const [following, setFollowing] = useState<any[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [showFollows, setShowFollows] = useState(false)

  // Panel collapse
  const [profilePanelOpen, setProfilePanelOpen] = useState(true)
  const [followsPanelOpen, setFollowsPanelOpen] = useState(true)

  // User stats modal (when clicking on a follower/following user)
  const [userStatsModal, setUserStatsModal] = useState<any>(null)
  const [userStatsData, setUserStatsData] = useState<any>(null)
  const [loadingUserStats, setLoadingUserStats] = useState(false)

  // Comments
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set())
  const [submittingComment, setSubmittingComment] = useState<Set<string>>(new Set())

  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSessionAndPosts()
    const channel = supabase
      .channel('hunts-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        if (pendingLike.current.size === 0) fetchPostsSilently()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  // Cerrar picker al hacer click fuera
  useEffect(() => {
    if (!openReactionPicker) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.spn-reaction-wrap')) setOpenReactionPicker(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openReactionPicker])

  async function fetchSessionAndPosts() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', user.id).maybeSingle()
        const userWithProfile = { ...user, profile }
        setCurrentUser(userWithProfile)
        currentUserRef.current = userWithProfile
        setNewUsername(profile?.username || '')
        setNewBio(profile?.bio || '')

        // Cargar qué reacción puso el usuario en cada post
        const { data: reactions } = await supabase
          .from('reactions')
          .select('post_id, reaction_type')
          .eq('user_id', user.id)
        if (reactions) {
          const map: Record<string, string> = {}
          reactions.forEach((r: any) => {
            // reaction_type puede ser un ID corto ('fire') o un emoji legacy ('🔥')
            const rt = r.reaction_type || 'fire'
            map[r.post_id] = idToEmoji(rt) !== rt ? idToEmoji(rt) : rt
          })
          setUserReactions(map)
          setLikedPosts(new Set(reactions.map((r: any) => r.post_id)))
        }

        const { data: followingData } = await supabase
          .from('follows')
          .select('following_id, profiles!follows_following_id_fkey(id, username, avatar_url)')
          .eq('follower_id', user.id)
        if (followingData) setFollowing(followingData)

        const { data: followersData } = await supabase
          .from('follows')
          .select('follower_id, profiles!follows_follower_id_fkey(id, username, avatar_url)')
          .eq('following_id', user.id)
        if (followersData) setFollowers(followersData)
      }
      await fetchPostsSilently()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoadingInitial(false)
    }
  }

  async function fetchPostsSilently() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url)')
      .order('clicks_count', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setPosts(data)

    // Cargar conteos de reacciones agrupados por post y emoji
    const { data: rxCounts } = await supabase
      .from('reactions')
      .select('post_id, reaction_type')
    if (rxCounts) {
      const counts: Record<string, Record<string, number>> = {}
      rxCounts.forEach((r: any) => {
        const rt = r.reaction_type || 'fire'
        // Convertir ID a emoji; si ya es emoji (legacy) lo deja igual
        const emoji = idToEmoji(rt) !== rt ? idToEmoji(rt) : rt
        if (!counts[r.post_id]) counts[r.post_id] = {}
        counts[r.post_id][emoji] = (counts[r.post_id][emoji] || 0) + 1
      })
      setPostReactionCounts(counts)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFile(f)
      setPreviewUrl(URL.createObjectURL(f))
    }
  }

  // FIX: manejo correcto de errores de Storage — muestra el error real de Supabase
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0] || !currentUser) return
    const avatarFile = e.target.files[0]
    setUploadingAvatar(true)
    try {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `avatar_${currentUser.id}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true, contentType: avatarFile.type })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', currentUser.id)
      setCurrentUser((prev: any) => ({ ...prev, profile: { ...prev.profile, avatar_url: publicUrl } }))
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      alert(`Error al subir imagen: ${error?.message || JSON.stringify(error)}`)
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleSaveUsername() {
    if (!currentUser || !newUsername.trim()) return
    setSavingName(true)
    try {
      await supabase.from('profiles').update({ username: newUsername.trim() }).eq('id', currentUser.id)
      setCurrentUser((prev: any) => {
        const updated = { ...prev, profile: { ...prev.profile, username: newUsername.trim() } }
        currentUserRef.current = updated
        return updated
      })
      setEditingName(false)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setSavingName(false)
    }
  }

  async function handleSaveBio() {
    if (!currentUser) return
    const wordCount = newBio.trim().split(/\s+/).filter(Boolean).length
    if (wordCount > 200) return alert('La biografía no puede superar las 200 palabras.')
    setSavingBio(true)
    try {
      await supabase.from('profiles').update({ bio: newBio.trim() }).eq('id', currentUser.id)
      setCurrentUser((prev: any) => ({ ...prev, profile: { ...prev.profile, bio: newBio.trim() } }))
      setEditingBio(false)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setSavingBio(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // FIX: manejo correcto de errores de Storage en posts
  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUser) return alert('Identificación requerida para publicar.')
    if (!content.trim() && !file) return
    setIsUploading(true)
    let imageUrl = ''
    try {
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `post_${currentUser.id}_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('hunts')
          .upload(fileName, file, { contentType: file.type })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('hunts').getPublicUrl(fileName)
        imageUrl = publicUrl
      }
      const { error } = await supabase.from('posts').insert([{
        user_id: currentUser.id,
        content,
        image_url: imageUrl,
        clicks_count: 0
      }])
      if (error) throw error
      setContent(''); setFile(null); setPreviewUrl(null); setIsModalOpen(false)
      fetchPostsSilently()
    } catch (error: any) {
      console.error('Post create error:', error)
      alert(`Error al publicar: ${error?.message || JSON.stringify(error)}`)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleReaction(postId: string, emoji: string, currentClicks: number) {
    if (!currentUser) return alert('Inicia sesión para reaccionar.')
    setOpenReactionPicker(null)

    const reactionId = emojiToId(emoji)  // guardamos ID corto en DB, no el emoji crudo
    const prevEmoji = userReactions[postId]
    const prevId = prevEmoji ? emojiToId(prevEmoji) : null
    const isSameEmoji = prevEmoji === emoji
    pendingLike.current.add(postId)

    if (prevEmoji) {
      // Quitar reacción anterior — optimistic
      setUserReactions(prev => { const n = { ...prev }; delete n[postId]; return n })
      setLikedPosts(prev => { const s = new Set(prev); s.delete(postId); return s })
      setPosts(cur => cur.map(p => p.id === postId ? { ...p, clicks_count: Math.max(0, p.clicks_count - 1) } : p))
      setPostReactionCounts(prev => {
        const updated = { ...prev[postId] }
        if (updated[prevEmoji]) { updated[prevEmoji] = Math.max(0, updated[prevEmoji] - 1); if (!updated[prevEmoji]) delete updated[prevEmoji] }
        return { ...prev, [postId]: updated }
      })
      await supabase.from('reactions').delete().eq('user_id', currentUser.id).eq('post_id', postId)
      await supabase.from('posts').update({ clicks_count: Math.max(0, currentClicks - 1) }).eq('id', postId)
    }

    if (!isSameEmoji) {
      // Agregar nueva reacción — optimistic
      setUserReactions(prev => ({ ...prev, [postId]: emoji }))
      setLikedPosts(prev => new Set([...prev, postId]))
      const newCount = prevEmoji ? currentClicks : currentClicks + 1
      setPosts(cur => cur.map(p => p.id === postId ? { ...p, clicks_count: newCount } : p))
      setPostReactionCounts(prev => {
        const updated = { ...(prev[postId] || {}) }
        updated[emoji] = (updated[emoji] || 0) + 1
        return { ...prev, [postId]: updated }
      })

      // Insertamos el ID corto como reaction_type — sin problemas de encoding Unicode
      const { error } = await supabase.from('reactions').insert([{
        user_id: currentUser.id,
        post_id: postId,
        reaction_type: reactionId
      }])
      if (error) {
        // Rollback si falla el insert
        setUserReactions(prev => { const n = { ...prev }; delete n[postId]; return n })
        setLikedPosts(prev => { const s = new Set(prev); s.delete(postId); return s })
        setPosts(cur => cur.map(p => p.id === postId ? { ...p, clicks_count: currentClicks } : p))
        setPostReactionCounts(prev => {
          const updated = { ...(prev[postId] || {}) }
          if (updated[emoji]) { updated[emoji] = Math.max(0, updated[emoji] - 1); if (!updated[emoji]) delete updated[emoji] }
          return { ...prev, [postId]: updated }
        })
      } else {
        await supabase.from('posts').update({ clicks_count: newCount }).eq('id', postId)
      }
    }

    pendingLike.current.delete(postId)
    // NO llamamos fetchPostsSilently() aquí — el estado optimista ya es correcto
    // y fetchPostsSilently pisaría las reacciones recién guardadas antes de que
    // el realtime channel las propague, causando el "se quita al segundo"
  }

  async function handleFollow(targetUserId: string) {
    if (!currentUser) return alert('Inicia sesión para seguir cazadores.')
    if (targetUserId === currentUser.id) return
    const isFollowing = following.some(f => f.following_id === targetUserId)
    if (isFollowing) {
      const { error } = await supabase.from('follows')
        .delete().eq('follower_id', currentUser.id).eq('following_id', targetUserId)
      if (!error) setFollowing(prev => prev.filter(f => f.following_id !== targetUserId))
    } else {
      const { data, error } = await supabase.from('follows')
        .insert([{ follower_id: currentUser.id, following_id: targetUserId }])
        .select('following_id, profiles!follows_following_id_fkey(id, username, avatar_url)')
        .single()
      if (!error && data) setFollowing(prev => [...prev, data])
    }
  }

  async function handleDeletePost(postId: string) {
    if (!confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== postId))
    } else {
      alert(`Error al eliminar: ${error.message}`)
    }
  }

  async function toggleComments(postId: string) {
    const isExpanded = expandedComments.has(postId)
    if (isExpanded) {
      setExpandedComments(prev => { const s = new Set(prev); s.delete(postId); return s })
    } else {
      setExpandedComments(prev => new Set([...prev, postId]))
      if (!comments[postId]) {
        await loadComments(postId)
      }
    }
  }

  async function loadComments(postId: string) {
    setLoadingComments(prev => new Set([...prev, postId]))
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(prev => ({ ...prev, [postId]: data || [] }))
    setLoadingComments(prev => { const s = new Set(prev); s.delete(postId); return s })
  }

  async function submitComment(postId: string) {
    if (!currentUser) return alert('Inicia sesión para comentar.')
    const text = commentInputs[postId]?.trim()
    if (!text) return
    setSubmittingComment(prev => new Set([...prev, postId]))
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: currentUser.id, content: text }])
      .select('*, profiles(username, avatar_url)')
      .single()
    if (!error && data) {
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }))
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    }
    setSubmittingComment(prev => { const s = new Set(prev); s.delete(postId); return s })
  }

  const getBioWordCount = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length

  async function openUserStats(userId: string, username: string, avatarUrl: string) {
    setUserStatsModal({ userId, username, avatarUrl })
    setLoadingUserStats(true)
    setUserStatsData(null)
    try {
      const [{ count: postsCount }, { data: rxData }, { count: followersCount }, { count: followingCount }] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('posts').select('clicks_count').eq('user_id', userId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
      ])
      const totalReactions = rxData ? rxData.reduce((a: number, p: any) => a + (p.clicks_count || 0), 0) : 0
      setUserStatsData({
        posts: postsCount || 0,
        reactions: totalReactions,
        status: 'Activo',
        followers: followersCount || 0,
        following: followingCount || 0,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingUserStats(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blood:      #7a0000;
          --blood-lt:   #cc1428;
          --blood-glow: rgba(204,20,40,0.75);
          --teal:       #1a7a68;
          --teal-lt:    #2ec49a;
          --paper:      #d4c8aa;
          --paper-dim:  rgba(212,200,170,0.6);
          --night:      #03040a;
          --night-mid:  #080a12;
          --night-card: rgba(10,12,20,0.97);
          --gold:       #c89e30;
          --gold-lt:    #e4b840;
          --fog:        rgba(212,200,170,0.07);
        }

        html { scroll-behavior: smooth; }

        body {
          background-color: var(--night);
          font-family: 'Crimson Text', Georgia, serif;
          color: var(--paper);
          min-height: 100vh;
          background-image:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(7,0,0,0.95) 0%, transparent 60%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          overflow-x: hidden;
        }

        /* ═══ SUPERNATURAL BACKGROUND ═══ */
        .spn-bg-canvas {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        /* Summoning circle */
        .spn-summon-ring {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: min(70vw, 70vh); height: min(70vw, 70vh);
          animation: summon-spin 40s linear infinite;
          filter: drop-shadow(0 0 6px rgba(176,16,32,0.9)) drop-shadow(0 0 18px rgba(176,16,32,0.5));
        }
        .spn-summon-ring-inner {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: min(52vw, 52vh); height: min(52vw, 52vh);
          animation: summon-spin 28s linear infinite reverse;
          filter: drop-shadow(0 0 5px rgba(42,170,136,0.9)) drop-shadow(0 0 14px rgba(42,170,136,0.5));
        }
        .spn-summon-ring-3 {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: min(35vw, 35vh); height: min(35vw, 35vh);
          animation: summon-spin 18s linear infinite;
          filter: drop-shadow(0 0 4px rgba(200,184,154,0.7)) drop-shadow(0 0 10px rgba(200,184,154,0.3));
        }
        @keyframes summon-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

        /* Glowing eyes scattered */
        .spn-eye {
          position: absolute; display: flex; align-items: center; gap: 5px;
          animation: eye-blink var(--eye-dur, 4s) ease-in-out infinite;
          animation-delay: var(--eye-delay, 0s);
          opacity: 0;
        }
        .spn-eye::before, .spn-eye::after {
          content: ''; width: var(--eye-size, 6px); height: var(--eye-size, 6px);
          background: radial-gradient(circle, #fff8c0 0%, #ffcc00 25%, rgba(255,80,0,0.9) 55%, transparent 80%);
          border-radius: 50%;
          box-shadow: 0 0 10px 4px rgba(255,200,0,0.7), 0 0 22px 8px rgba(255,100,0,0.35);
          display: block;
        }
        @keyframes eye-blink {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 0; }
          12% { opacity: 0.9; }
          15%, 85% { opacity: 0.85; }
          87% { opacity: 0.9; }
          50% { opacity: 0; transform: scaleY(0.05); }
          52% { opacity: 0.85; transform: scaleY(1); }
        }

        /* Moon */
        .spn-moon {
          position: fixed; top: 90px; right: 28px;
          width: 64px; height: 64px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fffef5, #fffde0 20%, #e8d590 50%, #c8a830 75%, #a07010);
          box-shadow: 0 0 28px 10px rgba(220,190,60,0.45), 0 0 70px 28px rgba(180,140,20,0.22), 0 0 120px 50px rgba(160,120,10,0.1);
          z-index: 1; pointer-events: none;
          animation: moon-glow 6s ease-in-out infinite;
        }
        .spn-moon::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle at 60% 40%, transparent 55%, rgba(0,0,0,0.15) 100%);
        }
        @keyframes moon-glow {
          0%, 100% { box-shadow: 0 0 28px 10px rgba(220,190,60,0.45), 0 0 70px 28px rgba(180,140,20,0.22), 0 0 120px 50px rgba(160,120,10,0.1); }
          50% { box-shadow: 0 0 40px 16px rgba(220,190,60,0.65), 0 0 100px 40px rgba(180,140,20,0.35), 0 0 160px 70px rgba(160,120,10,0.16); }
        }

        /* ═══ PANEL HEADERS with hamburger ═══ */
        .spn-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer; user-select: none;
        }
        .spn-hamburger {
          display: flex; flex-direction: column; gap: 4px; padding: 4px;
          background: none; border: none; cursor: pointer; opacity: 0.45; transition: opacity 0.2s;
        }
        .spn-hamburger:hover { opacity: 0.85; }
        .spn-hamburger span {
          display: block; width: 16px; height: 1.5px;
          background: rgba(42,170,136,0.8);
        }

        /* ═══ USER STATS MODAL ═══ */
        .spn-user-stats-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(1,2,4,0.88); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .spn-user-stats-modal {
          background: linear-gradient(160deg, #0a0c14, #070810);
          border: 1px solid rgba(42,170,136,0.35);
          border-top: 2px solid rgba(42,170,136,0.6);
          width: 100%; max-width: 320px; padding: 28px 24px;
          position: relative;
          box-shadow: 0 0 60px rgba(42,170,136,0.08), 0 0 120px rgba(0,0,0,0.9);
        }
        .spn-user-stats-close {
          position: absolute; top: 12px; right: 12px;
          background: none; border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.22); width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .spn-user-stats-close:hover { border-color: var(--blood-lt); color: var(--blood-lt); }
        .spn-user-stats-avatar {
          width: 56px; height: 56px; border: 1px solid rgba(42,170,136,0.3);
          overflow: hidden; margin: 0 auto 14px; display: block;
        }
        .spn-user-stats-avatar img { width: 100%; height: 100%; object-fit: cover; filter: desaturate(0.3); }
        .spn-user-stats-name {
          font-family: 'Special Elite', monospace; font-size: 13px;
          color: var(--paper); text-align: center; margin-bottom: 18px; letter-spacing: 0.06em;
        }
        .spn-follow-name-clickable {
          cursor: pointer; transition: color 0.2s;
        }
        .spn-follow-name-clickable:hover { color: rgba(42,170,136,0.85) !important; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--night); }
        ::-webkit-scrollbar-thumb { background: var(--blood); }
        * { accent-color: var(--blood); scrollbar-color: var(--blood) var(--night); scrollbar-width: thin; }

        /* ═══ HEADER ═══ */
        .spn-header {
          position: sticky; top: 0; z-index: 50;
          background: linear-gradient(180deg, rgba(2,2,6,1) 0%, rgba(3,4,10,0.96) 100%);
          border-bottom: 1px solid rgba(180,20,40,0.7);
          box-shadow: 0 2px 60px rgba(0,0,0,0.9), 0 1px 0 rgba(180,20,40,0.4), 0 0 40px rgba(140,10,20,0.15);
        }
        .spn-header-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          height: 68px; display: flex; align-items: center; justify-content: space-between;
        }
        .spn-logo {
          font-family: 'Cinzel', serif; font-weight: 700;
          font-size: clamp(0.95rem, 2.5vw, 1.25rem);
          letter-spacing: 0.12em; color: var(--paper);
          text-shadow: 0 0 30px rgba(200,184,154,0.18);
          text-transform: uppercase; display: flex; align-items: center; gap: 12px;
        }
        .spn-logo-divider {
          width: 1px; height: 28px;
          background: linear-gradient(180deg, transparent, rgba(122,0,0,0.6), transparent);
          margin: 0 4px;
        }
        .spn-tagline {
          font-family: 'Special Elite', monospace; font-size: 9px;
          color: rgba(200,184,154,0.25); letter-spacing: 0.3em; text-transform: uppercase;
        }
        .spn-header-right { display: flex; align-items: center; gap: 14px; }
        .spn-signout-btn {
          display: flex; align-items: center; gap: 7px;
          background: none; border: 1px solid rgba(122,0,0,0.35);
          color: rgba(200,184,154,0.35); padding: 6px 14px;
          font-family: 'Cinzel', serif; font-size: 8px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer;
          transition: all 0.25s;
        }
        .spn-signout-btn:hover {
          border-color: var(--blood-lt); color: rgba(200,184,154,0.7);
          background: rgba(122,0,0,0.08);
        }

        /* ═══ LAYOUT ═══ */
        .spn-layout {
          max-width: 1200px; margin: 0 auto; padding: 44px 24px 120px;
          display: grid; grid-template-columns: 1fr 280px; gap: 40px; align-items: start;
        }
        @media (max-width: 768px) {
          .spn-layout { grid-template-columns: 1fr; }
          .spn-sidebar { order: -1; }
        }

        /* ═══ FEED ═══ */
        .spn-feed-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 30px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(122,0,0,0.2);
        }
        .spn-feed-title {
          font-family: 'Cinzel', serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.4em; color: rgba(200,184,154,0.4); text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
        }
        .spn-live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--blood-lt); box-shadow: 0 0 8px var(--blood-lt);
          animation: pulse-dot 2s ease-in-out infinite; display: inline-block;
        }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--blood-lt); } 50% { opacity: 0.25; box-shadow: 0 0 4px var(--blood-lt); } }
        .spn-feed-count {
          font-family: 'Special Elite', monospace; font-size: 9px;
          color: rgba(200,184,154,0.2); letter-spacing: 0.18em; text-transform: uppercase;
        }

        /* ═══ CARD ═══ */
        .spn-card {
          background: var(--night-card);
          border: 1px solid rgba(122,0,0,0.15);
          border-left: 2px solid rgba(122,0,0,0.5);
          position: relative; overflow: hidden;
          transition: border-color 0.35s, box-shadow 0.35s; margin-bottom: 24px;
        }
        .spn-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, rgba(122,0,0,0.6), rgba(122,0,0,0.1) 50%, transparent);
        }
        .spn-card:hover {
          border-color: rgba(122,0,0,0.35);
          border-left-color: var(--blood-lt);
          box-shadow: -3px 0 24px rgba(122,0,0,0.1), 0 8px 40px rgba(0,0,0,0.5);
        }
        .spn-card-header {
          padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,0,0,0.28); border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .spn-card-user { display: flex; align-items: center; gap: 10px; }
        .spn-card-avatar {
          width: 32px; height: 32px; border: 1px solid rgba(122,0,0,0.4);
          overflow: hidden; flex-shrink: 0;
        }
        .spn-card-avatar img { width: 100%; height: 100%; object-fit: cover; filter: desaturate(0.35) brightness(0.88); }
        .spn-card-username {
          font-family: 'Special Elite', monospace; font-size: 11px;
          color: rgba(200,184,154,0.7);
        }
        .spn-card-date { font-family: 'Special Elite', monospace; font-size: 9px; color: rgba(200,184,154,0.22); margin-top: 2px; }
        .spn-card-header-right { display: flex; align-items: center; gap: 10px; }
        .spn-hot-badge {
          font-family: 'Cinzel', serif; font-size: 7px; font-weight: 700;
          letter-spacing: 0.1em; color: var(--gold);
          border: 1px solid rgba(184,146,42,0.35); padding: 2px 8px;
          text-transform: uppercase; background: rgba(184,146,42,0.04);
        }
        .spn-delete-btn {
          background: none; border: 1px solid rgba(122,0,0,0.2);
          color: rgba(122,0,0,0.4); width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .spn-delete-btn:hover { border-color: var(--blood-lt); color: var(--blood-lt); background: rgba(122,0,0,0.08); }

        .spn-card-body {
          padding: 20px 22px; font-size: 15.5px; line-height: 1.8;
          color: rgba(200,184,154,0.78); font-style: italic;
        }
        .spn-card-img { margin: 0 0 0; overflow: hidden; border-top: 1px solid rgba(122,0,0,0.12); }
        .spn-card-img img {
          width: 100%; display: block; max-height: 420px; object-fit: cover;
          filter: desaturate(0.45) contrast(1.08) brightness(0.7); transition: filter 0.55s;
        }
        .spn-card-img:hover img { filter: desaturate(0.15) contrast(1.04) brightness(0.85); }

        .spn-card-footer {
          padding: 10px 16px; border-top: 1px solid rgba(255,255,255,0.03);
          display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.22);
        }
        /* ═══ REACTION BUTTON & PICKER ═══ */
        .spn-reaction-wrap { position: relative; }
        .spn-reaction-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: 1px solid rgba(122,0,0,0.2);
          padding: 5px 12px; font-family: 'Special Elite', monospace;
          font-size: 11px; letter-spacing: 0.1em;
          color: rgba(200,184,154,0.45); cursor: pointer; transition: all 0.25s;
          white-space: nowrap;
        }
        .spn-reaction-btn.reacted { border-color: rgba(176,16,32,0.55); background: rgba(122,0,0,0.07); }
        .spn-reaction-btn:hover:not(:disabled) { border-color: rgba(122,0,0,0.5); color: rgba(200,184,154,0.75); }
        .spn-reaction-count { font-size: 10px; color: rgba(200,184,154,0.5); font-family: 'Special Elite', monospace; }
        .spn-reaction-picker {
          position: absolute; bottom: calc(100% + 8px); left: 0; z-index: 999;
          background: linear-gradient(160deg, #0a0c14, #070810);
          border: 1px solid rgba(122,0,0,0.45);
          border-top: 2px solid rgba(176,16,32,0.5);
          padding: 12px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
          min-width: 260px;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(122,0,0,0.12);
        }
        .spn-reaction-option {
          background: none; border: 1px solid transparent;
          width: 32px; height: 32px; font-size: 16px;
          cursor: pointer; transition: all 0.18s; display: flex;
          align-items: center; justify-content: center; border-radius: 2px;
        }
        .spn-reaction-option:hover { background: rgba(122,0,0,0.12); border-color: rgba(122,0,0,0.35); transform: scale(1.2); }
        .spn-reaction-option.selected { background: rgba(122,0,0,0.18); border-color: rgba(176,16,32,0.6); }
        .spn-reactions-summary {
          display: flex; flex-wrap: wrap; gap: 4px; align-items: center; padding: 6px 16px 0;
        }
        .spn-reaction-pill {
          display: flex; align-items: center; gap: 3px;
          background: rgba(0,0,0,0.3); border: 1px solid rgba(122,0,0,0.15);
          padding: 2px 7px; font-size: 11px; border-radius: 2px;
        }
        .spn-reaction-pill span { font-family: 'Special Elite', monospace; font-size: 9px; color: rgba(200,184,154,0.4); }

        /* ═══ BLOOD DRIPS ═══ */
        .spn-blood-drips {
          position: absolute; top: 0; left: 0; right: 0; height: 0;
          pointer-events: none; z-index: 5; overflow: visible;
        }
        .spn-blood-drop {
          position: absolute; top: 0;
          width: 3px; border-radius: 0 0 50% 50%;
          background: linear-gradient(180deg, rgba(176,0,0,0.9) 0%, rgba(120,0,0,0.7) 60%, rgba(80,0,0,0.0) 100%);
          animation: blood-fall 2.2s ease-in infinite;
          box-shadow: 0 0 4px rgba(176,0,0,0.5);
        }
        .spn-blood-drop::after {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(140,0,0,0.7);
          box-shadow: 0 0 6px rgba(176,0,0,0.6);
        }
        @keyframes blood-fall {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0.9; }
          40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          85% { opacity: 0.8; }
          100% { transform: scaleY(1) translateY(4px); opacity: 0; }
        }

        .spn-comment-toggle {
          display: flex; align-items: center; gap: 6px; margin-left: auto;
          background: none; border: 1px solid rgba(42,170,136,0.15);
          padding: 5px 12px; font-family: 'Special Elite', monospace;
          font-size: 9px; letter-spacing: 0.12em; color: rgba(42,170,136,0.4);
          text-transform: uppercase; cursor: pointer; transition: all 0.22s;
        }
        .spn-comment-toggle:hover { border-color: rgba(42,170,136,0.4); color: rgba(42,170,136,0.7); }

        /* ═══ COMMENTS ═══ */
        .spn-comments-section {
          border-top: 1px solid rgba(122,0,0,0.12);
          background: rgba(0,0,0,0.3);
          padding: 16px 18px;
        }
        .spn-comment-item {
          display: flex; gap: 10px; margin-bottom: 13px;
          padding-bottom: 13px; border-bottom: 1px solid rgba(255,255,255,0.035);
        }
        .spn-comment-item:last-of-type { border-bottom: none; margin-bottom: 10px; }
        .spn-comment-avatar {
          width: 24px; height: 24px; flex-shrink: 0;
          border: 1px solid rgba(122,0,0,0.3); overflow: hidden;
        }
        .spn-comment-avatar img { width: 100%; height: 100%; object-fit: cover; filter: desaturate(0.4); }
        .spn-comment-username {
          font-family: 'Special Elite', monospace; font-size: 9px;
          color: rgba(42,170,136,0.55); letter-spacing: 0.08em; margin-bottom: 3px;
        }
        .spn-comment-text {
          font-family: 'Crimson Text', serif; font-size: 13.5px;
          color: rgba(200,184,154,0.65); font-style: italic; line-height: 1.55;
        }
        .spn-comment-input-row {
          display: flex; gap: 8px; margin-top: 6px; align-items: flex-start;
        }
        .spn-comment-input {
          flex: 1; background: rgba(0,0,0,0.4);
          border: 1px solid rgba(122,0,0,0.18); border-bottom-color: rgba(42,170,136,0.2);
          color: var(--paper); font-family: 'Crimson Text', serif; font-size: 14px;
          font-style: italic; padding: 7px 10px; outline: none; resize: none;
          transition: border-color 0.2s; height: 36px; line-height: 1.4;
        }
        .spn-comment-input:focus { border-color: rgba(42,170,136,0.35); height: 68px; }
        .spn-comment-input::placeholder { color: rgba(200,184,154,0.18); }
        .spn-comment-submit {
          background: rgba(26,107,90,0.15); border: 1px solid rgba(42,170,136,0.25);
          color: rgba(42,170,136,0.5); padding: 7px 12px;
          font-family: 'Cinzel', serif; font-size: 7px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer;
          transition: all 0.22s; align-self: flex-end; white-space: nowrap;
        }
        .spn-comment-submit:hover:not(:disabled) { border-color: var(--teal-lt); color: var(--teal-lt); background: rgba(42,170,136,0.08); }
        .spn-comment-submit:disabled { opacity: 0.3; cursor: not-allowed; }
        .spn-no-comments {
          font-family: 'Special Elite', monospace; font-size: 9px;
          color: rgba(200,184,154,0.18); letter-spacing: 0.18em;
          text-transform: uppercase; text-align: center; padding: 8px 0 12px;
        }

        /* ═══ SIDEBAR ═══ */
        .spn-sidebar { position: sticky; top: 90px; }
        .spn-profile-card {
          background: linear-gradient(160deg, rgba(12,14,22,0.99), rgba(8,9,16,1));
          border: 1px solid rgba(42,170,136,0.12);
          border-top: 2px solid rgba(42,170,136,0.35);
          padding: 28px 22px; position: relative; overflow: hidden;
        }
        .spn-profile-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 100% 35% at 50% 0%, rgba(42,170,136,0.035) 0%, transparent 100%);
          pointer-events: none;
        }
        .spn-profile-title {
          font-family: 'Cinzel', serif; font-size: 8px; font-weight: 700;
          letter-spacing: 0.45em; color: rgba(42,170,136,0.35); text-transform: uppercase;
          margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid rgba(42,170,136,0.08);
          text-align: center;
        }
        .spn-avatar-wrap { position: relative; width: 88px; height: 88px; margin: 0 auto 18px; }
        .spn-avatar-img {
          width: 88px; height: 88px; border: 1px solid rgba(42,170,136,0.25);
          overflow: hidden; display: block;
        }
        .spn-avatar-img img {
          width: 100%; height: 100%; object-fit: cover;
          filter: desaturate(0.3) brightness(0.9); transition: filter 0.3s;
        }
        .spn-avatar-img:hover img { filter: none; }
        .spn-avatar-btn {
          position: absolute; bottom: -5px; right: -5px;
          width: 26px; height: 26px; background: var(--teal);
          border: 2px solid var(--night-mid);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .spn-avatar-btn:hover { background: var(--teal-lt); }
        .spn-profile-name-wrap { text-align: center; margin-bottom: 16px; }
        .spn-profile-name {
          font-family: 'Special Elite', monospace; font-size: 14px; color: var(--paper);
          letter-spacing: 0.05em;
        }
        .spn-name-input {
          background: rgba(0,0,0,0.5); border: 1px solid rgba(42,170,136,0.28);
          color: var(--teal-lt); font-family: 'Special Elite', monospace; font-size: 13px;
          padding: 5px 10px; outline: none; width: 100%; text-align: center; letter-spacing: 0.05em;
        }
        .spn-name-input:focus { border-color: var(--teal-lt); }
        .spn-icon-btn {
          background: none; border: 1px solid rgba(42,170,136,0.18);
          color: rgba(42,170,136,0.45); padding: 4px 8px;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center;
        }
        .spn-icon-btn:hover { border-color: var(--teal-lt); color: var(--teal-lt); }
        .spn-icon-btn:disabled { opacity: 0.35; }

        .spn-divider {
          border: none; border-top: 1px solid rgba(255,255,255,0.04);
          margin: 16px 0;
        }
        .spn-stat {
          display: flex; justify-content: space-between; align-items: center;
          padding: 5px 0; font-family: 'Special Elite', monospace; font-size: 9px;
          color: rgba(200,184,154,0.3); letter-spacing: 0.1em; text-transform: uppercase;
          border-bottom: 1px solid rgba(255,255,255,0.025);
        }
        .spn-stat span:last-child { color: rgba(200,184,154,0.65); font-size: 11px; }

        /* Bio */
        .spn-bio-section { margin-top: 18px; }
        .spn-bio-label {
          font-family: 'Cinzel', serif; font-size: 7px; font-weight: 700;
          letter-spacing: 0.32em; color: rgba(42,170,136,0.3); text-transform: uppercase;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 8px;
        }
        .spn-bio-text {
          font-family: 'Crimson Text', serif; font-size: 12.5px;
          font-style: italic; color: rgba(200,184,154,0.28); line-height: 1.65;
        }
        .spn-bio-textarea {
          width: 100%; background: rgba(0,0,0,0.45);
          border: 1px solid rgba(42,170,136,0.2); color: var(--paper);
          font-family: 'Crimson Text', serif; font-size: 13px; font-style: italic;
          padding: 8px 10px; outline: none; resize: none; height: 88px; line-height: 1.55;
          transition: border-color 0.2s;
        }
        .spn-bio-textarea:focus { border-color: rgba(42,170,136,0.38); }
        .spn-bio-count {
          font-family: 'Special Elite', monospace; font-size: 8px;
          color: rgba(200,184,154,0.22); text-align: right; margin-top: 4px; letter-spacing: 0.1em;
        }
        .spn-bio-count.over { color: var(--blood-lt); }
        .spn-bio-actions { display: flex; gap: 6px; margin-top: 7px; justify-content: flex-end; }

        /* Sign out */
        .spn-logout-row { margin-top: 20px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.04); }
        .spn-logout-full {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: none; border: 1px solid rgba(122,0,0,0.22);
          color: rgba(200,184,154,0.3); padding: 8px 12px;
          font-family: 'Cinzel', serif; font-size: 8px; font-weight: 600;
          letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; transition: all 0.25s;
        }
        .spn-logout-full:hover { border-color: rgba(122,0,0,0.5); color: rgba(200,184,154,0.55); background: rgba(122,0,0,0.06); }

        /* Follows */
        .spn-follows-card {
          background: linear-gradient(160deg, rgba(12,14,22,0.99), rgba(8,9,16,1));
          border: 1px solid rgba(42,170,136,0.1);
          border-top: 2px solid rgba(42,170,136,0.2);
          padding: 20px 22px; margin-top: 12px;
        }
        .spn-follows-title {
          font-family: 'Cinzel', serif; font-size: 8px; font-weight: 700;
          letter-spacing: 0.4em; color: rgba(42,170,136,0.3); text-transform: uppercase;
          margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;
        }
        .spn-follows-title:hover { color: rgba(42,170,136,0.55); }
        .spn-follows-tabs {
          display: flex; gap: 0; margin-bottom: 14px; border: 1px solid rgba(42,170,136,0.1);
        }
        .spn-follows-tab {
          flex: 1; background: none; border: none; padding: 6px 4px;
          font-family: 'Cinzel', serif; font-size: 7px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
          color: rgba(200,184,154,0.25);
        }
        .spn-follows-tab.active { background: rgba(42,170,136,0.08); color: rgba(42,170,136,0.6); }
        .spn-follows-tab:hover:not(.active) { color: rgba(200,184,154,0.45); }
        .spn-follow-item {
          display: flex; align-items: center; gap: 9px; padding: 7px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .spn-follow-item:last-child { border-bottom: none; }
        .spn-follow-avatar {
          width: 26px; height: 26px; flex-shrink: 0;
          border: 1px solid rgba(42,170,136,0.2); overflow: hidden;
        }
        .spn-follow-avatar img { width: 100%; height: 100%; object-fit: cover; filter: desaturate(0.4); }
        .spn-follow-name {
          font-family: 'Special Elite', monospace; font-size: 10px;
          color: rgba(200,184,154,0.55); flex: 1; letter-spacing: 0.04em;
        }
        .spn-unfollow-btn {
          background: none; border: 1px solid rgba(122,0,0,0.2);
          color: rgba(122,0,0,0.4); padding: 3px 7px;
          font-family: 'Cinzel', serif; font-size: 6px; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
        }
        .spn-unfollow-btn:hover { border-color: rgba(122,0,0,0.5); color: rgba(200,184,154,0.5); }
        .spn-follows-empty {
          font-family: 'Special Elite', monospace; font-size: 8px;
          color: rgba(200,184,154,0.15); letter-spacing: 0.15em; text-transform: uppercase;
          text-align: center; padding: 10px 0;
        }

        /* FAB */
        .spn-fab {
          position: fixed; bottom: 32px; right: 32px; z-index: 9999;
          width: 54px; height: 54px;
          background: linear-gradient(135deg, #5a0000, #900014);
          border: 1px solid rgba(176,16,32,0.6); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.9), 0 0 28px rgba(122,0,0,0.45), 0 0 70px rgba(122,0,0,0.1);
          transition: all 0.22s;
        }
        .spn-fab:hover {
          background: linear-gradient(135deg, #7a0000, #b00018);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.9), 0 0 42px rgba(176,16,32,0.6);
        }

        /* Modal */
        .spn-overlay {
          position: fixed; inset: 0; z-index: 200; background: rgba(1,2,4,0.94);
          backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .spn-modal {
          background: linear-gradient(160deg, #0a0c14, #070810);
          border: 1px solid rgba(122,0,0,0.35);
          border-top: 2px solid rgba(122,0,0,0.6);
          width: 100%; max-width: 520px; padding: 30px 28px; position: relative;
          box-shadow: 0 0 80px rgba(122,0,0,0.14), 0 0 200px rgba(0,0,0,0.85);
        }
        .spn-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 26px; padding-bottom: 14px; border-bottom: 1px solid rgba(122,0,0,0.15);
        }
        .spn-modal-title {
          font-family: 'Cinzel', serif; font-size: 9px; font-weight: 700;
          letter-spacing: 0.32em; color: rgba(176,16,32,0.8); text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .spn-modal-close {
          background: none; border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.22); width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .spn-modal-close:hover { border-color: var(--blood-lt); color: var(--blood-lt); }
        .spn-field-label {
          font-family: 'Cinzel', serif; font-size: 7.5px; font-weight: 700;
          letter-spacing: 0.3em; color: rgba(42,170,136,0.45); text-transform: uppercase;
          display: block; margin-bottom: 9px;
        }
        .spn-textarea {
          width: 100%; padding: 13px 15px;
          background: rgba(0,0,0,0.5); border: 1px solid rgba(122,0,0,0.18);
          border-bottom-color: rgba(122,0,0,0.35);
          color: var(--paper); font-family: 'Crimson Text', serif;
          font-size: 15px; font-style: italic; outline: none; resize: none; height: 120px;
          line-height: 1.7; transition: border-color 0.2s;
        }
        .spn-textarea:focus { border-color: rgba(122,0,0,0.45); }
        .spn-textarea::placeholder { color: rgba(200,184,154,0.15); font-style: italic; }
        .spn-upload-zone {
          border: 1px dashed rgba(122,0,0,0.2); padding: 22px; text-align: center;
          background: rgba(0,0,0,0.28); cursor: pointer; transition: all 0.2s;
        }
        .spn-upload-zone:hover { border-color: rgba(122,0,0,0.4); background: rgba(0,0,0,0.35); }
        .spn-upload-label {
          font-family: 'Cinzel', serif; font-size: 7.5px; font-weight: 600;
          letter-spacing: 0.22em; color: rgba(200,184,154,0.18); text-transform: uppercase;
          display: block; margin-top: 8px; transition: color 0.2s;
        }
        .spn-upload-zone:hover .spn-upload-label { color: rgba(200,184,154,0.38); }
        .spn-submit-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(90deg, #5a0000, #7a0010);
          border: 1px solid rgba(122,0,0,0.6); color: rgba(200,184,154,0.8);
          font-family: 'Cinzel', serif; font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.38em; text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s;
        }
        .spn-submit-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #7a0000, #9a0014);
          box-shadow: 0 0 30px rgba(122,0,0,0.3);
        }
        .spn-submit-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .spn-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 90px 0; gap: 18px; }
        .spn-loading-text {
          font-family: 'Special Elite', monospace; font-size: 9px; letter-spacing: 0.42em;
          color: rgba(122,0,0,0.4); text-transform: uppercase; animation: flicker 2.5s step-end infinite;
        }
        @keyframes flicker { 0%, 93%, 100% { opacity: 0.4; } 96% { opacity: 0.08; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* SUPERNATURAL BACKGROUND - client only to avoid SSR hydration mismatch */}
        <SupernaturalBackground />
        {/* HEADER */}
        <header className="spn-header">
          <div className="spn-header-inner">
            <div className="spn-logo">
              <Skull size={18} style={{ color: 'rgba(176,16,32,0.8)', filter: 'drop-shadow(0 0 10px rgba(176,16,32,0.5))' }} />
              El Diario del Cazador
            </div>
            <div className="spn-header-right">
              <div className="spn-tagline">Salvar a la gente · Cazar cosas</div>
              {currentUser && (
                <button className="spn-signout-btn" onClick={handleSignOut}>
                  <LogOut size={11} />
                  Salir
                </button>
              )}
            </div>
          </div>
        </header>

        {/* LAYOUT */}
        <div className="spn-layout">

          {/* ═══ FEED ═══ */}
          <main>
            <div className="spn-feed-header">
              <div className="spn-feed-title">
                <span className="spn-live-dot" />
                Registros Activos
              </div>
              <div className="spn-feed-count">{posts.length} casos</div>
            </div>

            {loadingInitial ? (
              <div className="spn-loading">
                <Loader2 size={28} style={{ color: 'rgba(122,0,0,0.4)', animation: 'spin 1.2s linear infinite' }} />
                <p className="spn-loading-text">Sintonizando frecuencia...</p>
              </div>
            ) : (
              <AnimatePresence>
                {[...posts].sort((a,b) => getTotalReactions(b.id) - getTotalReactions(a.id)).map((post, i) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035 }}
                    className="spn-card"
                    style={getPostBloodStyle(getTotalReactions(post.id))}
                  >
                    {/* Sangre cayendo — aparece a partir de 100 reacciones */}
                    {getTotalReactions(post.id) >= 100 && (
                      <div className="spn-blood-drips" aria-hidden="true">
                        {BLOOD_DROPS.map((left, di) => (
                          <div key={di} className="spn-blood-drop" style={{ left: `${left}%`, animationDelay: `${di * 0.18}s`, height: `${14 + (di % 5) * 8}px` }} />
                        ))}
                      </div>
                    )}
                    <div className="spn-card-header">
                      <div className="spn-card-user">
                        <div className="spn-card-avatar">
                          <img src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.user_id}`} alt="" />
                        </div>
                        <div>
                          <div className="spn-card-username" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            @{post.profiles?.username || 'Cazador_Anónimo'}
                            {currentUser && currentUser.id !== post.user_id && (
                              <button
                                onClick={() => handleFollow(post.user_id)}
                                style={{
                                  background: 'none',
                                  border: `1px solid ${following.some(f => f.following_id === post.user_id) ? 'rgba(42,170,136,0.35)' : 'rgba(200,184,154,0.12)'}`,
                                  color: following.some(f => f.following_id === post.user_id) ? 'rgba(42,170,136,0.6)' : 'rgba(200,184,154,0.25)',
                                  padding: '2px 7px', fontFamily: "'Cinzel', serif", fontSize: 6,
                                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                                  cursor: 'pointer', transition: 'all 0.2s'
                                }}
                              >
                                {following.some(f => f.following_id === post.user_id) ? 'Siguiendo' : '+ Seguir'}
                              </button>
                            )}
                          </div>
                          <div className="spn-card-date">{new Date(post.created_at).toLocaleString('es-ES')}</div>
                        </div>
                      </div>
                      <div className="spn-card-header-right">
                        {getTotalReactions(post.id) > 15 && <span className="spn-hot-badge">⚡ Alta Actividad</span>}
                        {currentUser && currentUser.id === post.user_id && (
                          <button className="spn-delete-btn" onClick={() => handleDeletePost(post.id)} title="Eliminar registro">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>

                    {post.content && <div className="spn-card-body">{post.content}</div>}

                    {post.image_url && (
                      <div className="spn-card-img"><img src={post.image_url} alt="Evidencia" /></div>
                    )}

                    {/* Resumen de reacciones */}
                    {postReactionCounts[post.id] && Object.keys(postReactionCounts[post.id]).length > 0 && (
                      <div className="spn-reactions-summary">
                        {Object.entries(postReactionCounts[post.id])
                          .sort((a, b) => b[1] - a[1])
                          .map(([emoji, count]) => (
                            <div key={emoji} className="spn-reaction-pill">
                              {emoji}<span>{count}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="spn-card-footer">
                      {/* Botón de reacción con picker */}
                      <div className="spn-reaction-wrap">
                        <button
                          onClick={() => setOpenReactionPicker(prev => prev === post.id ? null : post.id)}
                          className={`spn-reaction-btn${userReactions[post.id] ? ' reacted' : ''}`}
                          title="Reaccionar"
                        >
                          {userReactions[post.id] ? (
                            <><span style={{fontSize:14}}>{userReactions[post.id]}</span><span className="spn-reaction-count">{post.clicks_count}</span></>
                          ) : (
                            <><span style={{fontSize:13, opacity:0.5}}>👁</span><span className="spn-reaction-count">{post.clicks_count}</span><span style={{fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase'}}>reaccionar</span></>
                          )}
                        </button>
                        {openReactionPicker === post.id && (
                          <div className="spn-reaction-picker">
                            {REACTIONS.map(r => (
                              <button
                                key={r.emoji}
                                className={`spn-reaction-option${userReactions[post.id] === r.emoji ? ' selected' : ''}`}
                                title={r.label}
                                onClick={() => handleReaction(post.id, r.emoji, post.clicks_count)}
                              >
                                {r.emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        className="spn-comment-toggle"
                        onClick={() => toggleComments(post.id)}
                        title="Ver comentarios"
                      >
                        <MessageSquare size={10} />
                        {comments[post.id]?.length ? `${comments[post.id].length}` : ''}
                        {expandedComments.has(post.id) ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                      </button>
                    </div>

                    {/* Comments section */}
                    <AnimatePresence>
                      {expandedComments.has(post.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="spn-comments-section"
                        >
                          {loadingComments.has(post.id) ? (
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                              <Loader2 size={14} style={{ color: 'rgba(42,170,136,0.35)', animation: 'spin 1s linear infinite' }} />
                            </div>
                          ) : (
                            <>
                              {(!comments[post.id] || comments[post.id].length === 0) && (
                                <p className="spn-no-comments">Sin testimonios aún</p>
                              )}
                              {comments[post.id]?.map((c: any) => (
                                <div key={c.id} className="spn-comment-item">
                                  <div className="spn-comment-avatar">
                                    <img src={c.profiles?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${c.user_id}`} alt="" />
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div className="spn-comment-username">@{c.profiles?.username || 'Anónimo'}</div>
                                    <div className="spn-comment-text">{c.content}</div>
                                  </div>
                                </div>
                              ))}
                              {currentUser && (
                                <div className="spn-comment-input-row">
                                  <textarea
                                    className="spn-comment-input"
                                    placeholder="Deja tu testimonio..."
                                    value={commentInputs[post.id] || ''}
                                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(post.id) } }}
                                  />
                                  <button
                                    className="spn-comment-submit"
                                    onClick={() => submitComment(post.id)}
                                    disabled={submittingComment.has(post.id) || !commentInputs[post.id]?.trim()}
                                  >
                                    {submittingComment.has(post.id)
                                      ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} />
                                      : 'Registrar'
                                    }
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                ))}
              </AnimatePresence>
            )}
          </main>

          {/* ═══ SIDEBAR ═══ */}
          <aside className="spn-sidebar">
            {currentUser ? (
              <>
              <div className="spn-profile-card">
                <div className="spn-panel-header" onClick={() => setProfilePanelOpen(v => !v)}>
                  <div className="spn-profile-title" style={{marginBottom:0, paddingBottom:0, border:'none', flex:1}}>— Cazador —</div>
                  <button className="spn-hamburger" aria-label="Toggle profile">
                    <span/><span/><span/>
                  </button>
                </div>

                {profilePanelOpen && (<>

                {/* Avatar */}
                <div className="spn-avatar-wrap">
                  <div className="spn-avatar-img">
                    {uploadingAvatar ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08090f' }}>
                        <Loader2 size={18} style={{ color: 'rgba(42,170,136,0.45)', animation: 'spin 1s linear infinite' }} />
                      </div>
                    ) : (
                      <img src={currentUser.profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.id}`} alt="avatar" />
                    )}
                  </div>
                  <button className="spn-avatar-btn" onClick={() => avatarInputRef.current?.click()} title="Cambiar foto">
                    <Camera size={12} color="#fff" />
                  </button>
                  <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
                </div>

                {/* Nombre */}
                <div className="spn-profile-name-wrap">
                  {editingName ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <input
                        className="spn-name-input"
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveUsername(); if (e.key === 'Escape') setEditingName(false) }}
                        autoFocus maxLength={30} placeholder="tu_alias"
                      />
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="spn-icon-btn" onClick={handleSaveUsername} disabled={savingName}>
                          {savingName ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={11} />}
                        </button>
                        <button className="spn-icon-btn" onClick={() => setEditingName(false)}><X size={11} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="spn-profile-name">@{currentUser.profile?.username || 'Cazador_Anónimo'}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
                        <button className="spn-icon-btn" onClick={() => setEditingName(true)} title="Editar nombre">
                          <Edit3 size={10} />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <hr className="spn-divider" />

                <div className="spn-stat">
                  <span>Registros</span>
                  <span>{posts.filter(p => p.user_id === currentUser.id).length}</span>
                </div>
                <div className="spn-stat">
                  <span>Reacciones</span>
                  <span>{posts.filter(p => p.user_id === currentUser.id).reduce((a, p) => a + getTotalReactions(p.id), 0)}</span>
                </div>
                <div className="spn-stat">
                  <span>Estado</span>
                  <span style={{ color: 'rgba(42,170,136,0.7)' }}>Activo</span>
                </div>

                {/* Bio editable */}
                <div className="spn-bio-section">
                  <div className="spn-bio-label">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <BookOpen size={9} />
                      Bitácora
                    </span>
                    {!editingBio && (
                      <button className="spn-icon-btn" onClick={() => { setNewBio(currentUser.profile?.bio || ''); setEditingBio(true) }} title="Editar biografía">
                        <Edit3 size={9} />
                      </button>
                    )}
                  </div>

                  {editingBio ? (
                    <>
                      <textarea
                        className="spn-bio-textarea"
                        value={newBio}
                        onChange={e => setNewBio(e.target.value)}
                        placeholder="Describe tu historia como cazador..."
                        autoFocus
                      />
                      <div className={`spn-bio-count${getBioWordCount(newBio) > 200 ? ' over' : ''}`}>
                        {getBioWordCount(newBio)} / 200 palabras
                      </div>
                      <div className="spn-bio-actions">
                        <button className="spn-icon-btn" onClick={() => setEditingBio(false)}><X size={10} /></button>
                        <button
                          className="spn-icon-btn"
                          onClick={handleSaveBio}
                          disabled={savingBio || getBioWordCount(newBio) > 200}
                        >
                          {savingBio ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={10} />}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="spn-bio-text">
                      {currentUser.profile?.bio || '"El camino de los justos está sembrado de peligro."'}
                    </div>
                  )}
                </div>

                {/* Cerrar sesión */}
                <div className="spn-logout-row">
                  <button className="spn-logout-full" onClick={handleSignOut}>
                    <LogOut size={10} />
                    Cerrar sesión
                  </button>
                </div>
                </>)}
              </div>

              {/* ═══ FOLLOWS CARD ═══ */}
              <div className="spn-follows-card">
                <div className="spn-panel-header" onClick={() => setFollowsPanelOpen(v => !v)}>
                  <div className="spn-follows-title" style={{marginBottom:0, flex:1}} onClick={e => e.stopPropagation()}>
                    <span>— Vínculos —</span>
                  </div>
                  <button className="spn-hamburger" aria-label="Toggle follows">
                    <span/><span/><span/>
                  </button>
                </div>
                {followsPanelOpen && (
                  <>
                    <div className="spn-follows-tabs" style={{marginTop:14}}>
                      <button
                        className="spn-follows-tab active"
                        style={{ borderRight: '1px solid rgba(42,170,136,0.1)' }}
                        onClick={() => {}}
                      >
                        Siguiendo ({following.length})
                      </button>
                    </div>
                    {following.length === 0 ? (
                      <p className="spn-follows-empty">Sin vínculos aún</p>
                    ) : (
                      following.map((f: any) => (
                        <div key={f.following_id} className="spn-follow-item">
                          <div className="spn-follow-avatar">
                            <img src={f.profiles?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.following_id}`} alt="" />
                          </div>
                          <span
                            className="spn-follow-name spn-follow-name-clickable"
                            onClick={() => openUserStats(f.following_id, f.profiles?.username || 'Cazador', f.profiles?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.following_id}`)}
                          >@{f.profiles?.username || 'Cazador'}</span>
                          <button className="spn-unfollow-btn" onClick={() => handleFollow(f.following_id)}>
                            Desvincular
                          </button>
                        </div>
                      ))
                    )}
                    <hr className="spn-divider" style={{ margin: '12px 0' }} />
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(42,170,136,0.25)', textTransform: 'uppercase', marginBottom: 10 }}>
                      Seguidores ({followers.length})
                    </div>
                    {followers.length === 0 ? (
                      <p className="spn-follows-empty">Sin seguidores aún</p>
                    ) : (
                      followers.map((f: any) => (
                        <div key={f.follower_id} className="spn-follow-item">
                          <div className="spn-follow-avatar">
                            <img src={f.profiles?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.follower_id}`} alt="" />
                          </div>
                          <span
                            className="spn-follow-name spn-follow-name-clickable"
                            onClick={() => openUserStats(f.follower_id, f.profiles?.username || 'Cazador', f.profiles?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.follower_id}`)}
                          >@{f.profiles?.username || 'Cazador'}</span>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
              </>
            ) : (
              <div className="spn-profile-card" style={{ textAlign: 'center' }}>
                <div className="spn-profile-title">— Identificación —</div>
                <Skull size={28} style={{ color: 'rgba(122,0,0,0.22)', margin: '0 auto 16px', display: 'block' }} />
                <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(200,184,154,0.28)', lineHeight: 1.65 }}>
                  Inicia sesión para<br />unirte a la cacería.
                </p>
                <div className="spn-logout-row">
                  <button className="spn-logout-full" onClick={() => router.push('/login')}>
                    <LogOut size={10} />
                    Acceder
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* FAB */}
        <motion.button
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
          onClick={() => setIsModalOpen(true)}
          className="spn-fab" title="Nuevo Registro"
        >
          <Crosshair size={22} style={{ color: 'rgba(200,184,154,0.85)' }} />
        </motion.button>

        {/* MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="spn-overlay">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                className="spn-modal"
              >
                <div className="spn-modal-header">
                  <h2 className="spn-modal-title">
                    <Flame size={13} style={{ color: 'rgba(200,80,0,0.8)' }} />
                    Nuevo Registro de Cacería
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="spn-modal-close"><X size={13} /></button>
                </div>

                <form onSubmit={createPost} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label className="spn-field-label">Descripción del Incidente</label>
                    <textarea
                      className="spn-textarea"
                      placeholder="¿Qué encontraste en las sombras?..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="spn-field-label">Evidencia Fotográfica</label>
                    <div className="spn-upload-zone" onClick={() => !previewUrl && fileInputRef.current?.click()}>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
                      {previewUrl ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={previewUrl} alt="Vista previa" style={{ maxHeight: 120, filter: 'desaturate(0.3)', display: 'block' }} />
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setFile(null); setPreviewUrl(null) }}
                            style={{ position: 'absolute', top: -8, right: -8, background: '#7a0000', border: 'none', color: '#fff', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon size={20} style={{ color: 'rgba(200,184,154,0.14)', margin: '0 auto' }} />
                          <span className="spn-upload-label">Adjuntar Evidencia</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button type="submit" disabled={isUploading || (!content.trim() && !file)} className="spn-submit-btn">
                    {isUploading
                      ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Transmitiendo...</>
                      : <><Skull size={14} /> Sellar Registro</>
                    }
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* USER STATS MODAL */}
        {userStatsModal && (
          <div className="spn-user-stats-overlay" onClick={() => setUserStatsModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="spn-user-stats-modal"
              onClick={e => e.stopPropagation()}
            >
              <button className="spn-user-stats-close" onClick={() => setUserStatsModal(null)}><X size={11}/></button>
              <div className="spn-user-stats-avatar">
                <img src={userStatsModal.avatarUrl} alt=""/>
              </div>
              <div className="spn-user-stats-name">@{userStatsModal.username}</div>
              {loadingUserStats ? (
                <div style={{textAlign:'center',padding:'18px 0'}}>
                  <Loader2 size={18} style={{color:'rgba(42,170,136,0.45)',animation:'spin 1s linear infinite'}}/>
                </div>
              ) : userStatsData ? (
                <>
                  <div className="spn-stat"><span>Registros</span><span>{userStatsData.posts}</span></div>
                  <div className="spn-stat"><span>Reacciones</span><span>{userStatsData.reactions}</span></div>
                  <div className="spn-stat"><span>Estado</span><span style={{color:'rgba(42,170,136,0.7)'}}>{userStatsData.status}</span></div>
                  <div className="spn-stat"><span>Seguidores</span><span>{userStatsData.followers}</span></div>
                  <div className="spn-stat"><span>Siguiendo</span><span>{userStatsData.following}</span></div>
                </>
              ) : null}
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { Clock, Mail, Bell, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[100px] sm:min-w-[120px] transition-transform hover:scale-105 duration-300">
        <span className="text-3xl sm:text-5xl font-bold text-aura-gold mb-1 font-display">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs sm:text-sm text-aura-silver uppercase tracking-widest">
            {label}
        </span>
    </div>
)

export default function ComingSoon() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ loading: false, message: '', error: false })
    const [timeLeft, setTimeLeft] = useState({
        days: 100,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        // Set fixed target date: May 21, 2026 (100 days from initial request)
        const targetDate = new Date('2026-05-21T00:00:00')

        const timer = setInterval(() => {
            const now = new Date()
            const difference = targetDate - now

            if (difference <= 0) {
                clearInterval(timer)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setStatus({ loading: true, message: '', error: false })
        try {
            const templateParams = {
                user_email: email,
                reply_to: email,
                message: `New subscription request from Aura Fashions Coming Soon page: ${email}`
            }

            await emailjs.send(
                'service_swmb7dl',
                'template_o4ov7to',
                templateParams,
                'PVgiJmZyrqHaSmurL'
            )

            setStatus({
                loading: false,
                message: 'Perfect! We will notify you when we go live.',
                error: false
            })
            setEmail('')
        } catch (error) {
            console.error('EmailJS Error:', error)
            setStatus({
                loading: false,
                message: 'Failed to send notification. Please try again later.',
                error: true
            })
        }
    }

    return (
        <div className="min-h-screen bg-aura-black relative flex items-center justify-center overflow-hidden px-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-aura-gold/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-aura-gold/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-4xl w-full relative z-10 text-center">
                {/* Brand Logo / Name */}
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-aura-gold font-display text-2xl tracking-[0.3em] font-light uppercase">
                        Aura Fashions
                    </h2>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold text-aura-white animate-slide-up">
                            Something Beautiful <br />
                            <span className="text-aura-gold">Is Coming Soon</span>
                        </h1>
                        <p className="text-aura-silver text-lg max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            We're meticulously crafting a collection that redefines minimalist fashion.
                            Get ready for premium T-shirts and hoodies that speak volumes.
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <TimeBox value={timeLeft.days} label="Days" />
                        <TimeBox value={timeLeft.hours} label="Hours" />
                        <TimeBox value={timeLeft.minutes} label="Minutes" />
                        <TimeBox value={timeLeft.seconds} label="Seconds" />
                    </div>

                    {/* Subscription Form */}
                    <div className="max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <form onSubmit={handleSubmit} className="relative group">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aura-silver group-focus-within:text-aura-gold transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-aura-white px-12 py-4 rounded-xl focus:outline-none focus:border-aura-gold/50 focus:bg-white/10 transition-all placeholder:text-aura-silver/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="bg-aura-gold hover:bg-aura-gold/90 text-aura-black font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
                                >
                                    {status.loading ? (
                                        <div className="w-5 h-5 border-2 border-aura-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Notify Me</span>
                                            <Bell className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Status Message */}
                            {status.message && (
                                <div className={`mt-4 flex items-center justify-center space-x-2 animate-fade-in ${status.error ? 'text-red-400' : 'text-green-400'}`}>
                                    {status.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{status.message}</span>
                                </div>
                            )}
                        </form>
                        <p className="mt-4 text-aura-silver/40 text-xs">
                            We respect your privacy. No spam, only launch updates.
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-aura-silver/60 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p>© 2026 Aura Fashions. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-aura-gold cursor-pointer transition-colors">Instagram</span>
                        <span className="hover:text-aura-gold cursor-pointer transition-colors">Twitter</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

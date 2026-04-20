import React, {useState,useEffect,useRef} from "react";
import {motion,AnimatePresence,useMotionValue} from "framer-motion";

function SplashScreen({onComplete}){
	useEffect(()=>{
		const timer=setTimeout(()=>onComplete(),2500);
		return()=>clearTimeout(timer);
	},[onComplete]);
	
	return(
		<motion.div 
			initial={{opacity:1}}
			animate={{opacity:1}}
			exit={{opacity:0,y:-50}}
			transition={{duration:.5}}
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050816]"
		>
			<motion.div 
				initial={{scale:.8,opacity:0}}
				animate={{scale:1,opacity:1}}
				transition={{duration:.4}}
				className="text-center"
			>
				<motion.h1 
					initial={{y:20,opacity:0}}
					animate={{y:0,opacity:1}}
					transition={{delay:.3,duration:.5}}
					className="text-6xl font-bold tracking-[0.15em] text-white mb-4"
				>
					ZAKARIA DEV
				</motion.h1>
				<motion.div 
					initial={{scaleX:0}}
					animate={{scaleX:1}}
					transition={{delay:.6,duration:.4}}
					className="h-0.5 w-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 mx-auto rounded-full"
				/>
				<motion.p 
					initial={{opacity:0}}
					animate={{opacity:1}}
					transition={{delay:.8}}
					className="text-sm text-white/50 mt-4 tracking-widest"
				>
					JUNIOR DEVELOPER
				</motion.p>
			</motion.div>
		</motion.div>
	);
}

function useMousePosition(){
	const[mousePosition,setMousePosition]=useState({x:0,y:0});
	useEffect(()=>{
		const updateMouse=(e)=>setMousePosition({x:e.clientX,y:e.clientY});
		window.addEventListener("mousemove",updateMouse);
		return()=>window.removeEventListener("mousemove",updateMouse);
	},[]);
	return mousePosition;
}

const cursor={x:0,y:0,visible:false};
const cursorDot={x:0,y:0};
const hoverState={hover:false};
const clickState={active:false};

function CustomCursor(){
	const isTouch=useRef(false);
	const dotRef=useRef(null);
	
	useEffect(()=>{
		if("ontouchstart" in window || navigator.maxTouchPoints > 0){
			isTouch.current=true;
			return;
		}
		
		const dpiScale=window.devicePixelRatio||1;
		const baseEase=0.55*Math.min(dpiScale,1.2);
		
		const move=(e)=>{
			cursor.x=e.clientX;
			cursor.y=e.clientY;
			cursor.visible=true;
		};
		
		const leave=()=>{cursor.visible=false;};
		
		const over=(e)=>{
			const t=e.target;
			const link=t.tagName==="A"||t.tagName==="BUTTON"||t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.closest("a")||t.closest("button")||t.closest("[role='button']")||t.getAttribute("href")||t.closest("[tabindex]")||t.getAttribute("contenteditable");
			hoverState.hover=!!link;
		};
		
		const mouseDown=()=>{
			clickState.active=true;
		};
		
		const mouseUp=()=>{
			clickState.active=false;
		};
		
		let frame;
		const loop=()=>{
			const ease=hoverState.hover?0.80:baseEase;
			const clickScale=clickState.active?1.5:1;
			const hoverScale=hoverState.hover?1.8:1;
			const scale=hoverScale*clickScale;
			
			cursorDot.x+=(cursor.x-cursorDot.x)*ease;
			cursorDot.y+=(cursor.y-cursorDot.y)*ease;
			
			if(dotRef.current){
				const opacity=clickState.active?0.6:(hoverState.hover?0.7:1);
				dotRef.current.style.transform=`translate(${cursorDot.x}px,${cursorDot.y}px) scale(${scale}) translate(-50%,-50%)`;
				dotRef.current.style.opacity=cursor.visible?String(opacity):"0";
			}
			
			frame=requestAnimationFrame(loop);
		};
		
		window.addEventListener("mousemove",move);
		document.addEventListener("mouseleave",leave);
		document.addEventListener("mouseover",over);
		document.addEventListener("mousedown",mouseDown);
		document.addEventListener("mouseup",mouseUp);
		loop();
		
		return()=>{
			window.removeEventListener("mousemove",move);
			document.removeEventListener("mouseleave",leave);
			document.removeEventListener("mouseover",over);
			document.removeEventListener("mousedown",mouseDown);
			document.removeEventListener("mouseup",mouseUp);
			cancelAnimationFrame(frame);
		};
	},[]);
	
	if(isTouch.current)return null;
	
	return(
		<div ref={dotRef} className="fixed top-0 left-0 rounded-full bg-white z-[9999] pointer-events-none opacity-0" style={{width:10,height:10,boxShadow:"0 0 20px rgba(255,255,255,0.9),0 0 40px rgba(255,255,255,0.5)"}} />
	);
}

function ContactForm({email}){
	const[formState,setFormState]=useState({name:"",email:"",message:""});
	const[status,setStatus]=useState(null);
	
	const handleSubmit=async(e)=>{
		e.preventDefault();
		setStatus("sending");
		
		try{
			const response=await fetch("https://api.web3forms.com/submit",{
				method:"POST",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify({
					access_key:"b483e220-1810-4e48-a438-368e0f4e0be8",
					...formState,
					to:email
				})
			});
			if(response.ok){
				setStatus("success");
				setFormState({name:"",email:"",message:""});
			}else{
				setStatus("error");
			}
		}catch{
			setStatus("error");
		}
	};
	
	return(
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Name</label>
				<input 
					type="text" 
					placeholder="John Doe"
					value={formState.name}
					onChange={(e)=>setFormState({...formState,name:e.target.value})}
					required
					className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
				/>
			</div>
			<div>
				<label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Email</label>
				<input 
					type="email" 
					placeholder="john@example.com"
					value={formState.email}
					onChange={(e)=>setFormState({...formState,email:e.target.value})}
					required
					className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
				/>
			</div>
			<div>
				<label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Message</label>
				<textarea 
					placeholder="Tell me about your project..."
					rows={5}
					value={formState.message}
					onChange={(e)=>setFormState({...formState,message:e.target.value})}
					required
					className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
				/>
			</div>
			<motion.button 
				type="submit"
				disabled={status==="sending"||status==="success"}
				whileHover={{scale:1.01}}
				whileTap={{scale:0.99}}
				className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status==="sending"?<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</span>:status==="success"?<span className="flex items-center justify-center gap-2"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Message Sent!</span>:status==="error"?<span className="flex items-center justify-center gap-2"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Try Again</span>:<span>Send Message</span>}
			</motion.button>
		</form>
	);
}

function AnimatedBackground(){
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const colors = {
			purple: "rgb(232, 121, 249)",
			blue: "rgb(96, 165, 250)",
			green: "rgb(94, 234, 212)",
		};

		const colorCombos = [
			[colors.purple, colors.blue, colors.green],
			[colors.purple, colors.green, colors.blue],
			[colors.green, colors.purple, colors.blue],
			[colors.green, colors.blue, colors.purple],
			[colors.blue, colors.green, colors.purple],
			[colors.blue, colors.purple, colors.green],
		];

		const animationTime = 45;
		const length = 25;

		for (let i = 0; i < length; i++) {
			const beam = document.createElement("div");
			beam.className = "rainbow";
			
			const r = Math.floor(Math.random() * 6);
			const selectedColors = colorCombos[r];
			
			const delay = -(i / length) * animationTime;
			const duration = animationTime - (animationTime / length / 2) * i;
			
			beam.style.cssText = `
				height: 100vh;
				width: 0;
				top: 0;
				position: absolute;
				transform: rotate(10deg);
				transform-origin: top right;
				box-shadow: 
					-130px 0 80px 40px white,
					-50px 0 50px 25px ${selectedColors[0]},
					0 0 50px 25px ${selectedColors[1]},
					50px 0 50px 25px ${selectedColors[2]},
					130px 0 80px 40px white;
				animation: slide ${duration}s linear infinite;
				animation-delay: ${delay}s;
			`;
			
			container.appendChild(beam);
		}

		const h1 = document.createElement("div");
		h1.className = "h";
		h1.style.cssText = `
			box-shadow: 0 0 50vh 40vh white;
			width: 100vw;
			height: 0;
			bottom: 0;
			left: 0;
			position: absolute;
		`;
		container.appendChild(h1);

		const v1 = document.createElement("div");
		v1.className = "v";
		v1.style.cssText = `
			box-shadow: 0 0 35vw 25vw white;
			width: 0;
			height: 100vh;
			bottom: 0;
			left: 0;
			position: absolute;
		`;
		container.appendChild(v1);

		const style = document.createElement("style");
		style.textContent = `
			@keyframes slide {
				from { right: -25vw; }
				to { right: 125vw; }
			}
		`;
		container.appendChild(style);

		return () => {
			container.innerHTML = "";
		};
	}, []);

	return (
		<div 
			ref={containerRef} 
			className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
			style={{ background: "#050816" }}
		/>
	);
}

const ArrowRightIcon = ({className="h-4 w-4"}) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
		<path d="M5 12h14" />
		<path d="m12 5 7 7-7 7" />
	</svg>
);

const ExternalLinkIcon = ({className="h-4 w-4"}) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
		<path d="M14 3h7v7" />
		<path d="M10 14 21 3" />
		<path d="M21 14v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h4" />
	</svg>
);

const MailIcon = ({className="h-4 w-4"}) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="m3 7 9 6 9-6" />
	</svg>
);

const GitHubIcon = ({className="h-4 w-4"}) => (
	<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
		<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a10.96 10.96 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.73.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.08.78 2.18 0 1.57-.01 2.83-.01 3.21 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
	</svg>
);

const LinkedInIcon = ({className="h-4 w-4"}) => (
	<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
		<path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.62c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
	</svg>
);

const TechIcon=({type,className=""})=>{
	const icons={
		html:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>,
		css:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>,
		js:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067z"/></svg>,
		react:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 10.632c-.188 0-.344.06-.44.163-.096-.103-.252-.163-.44-.163-.345 0-.621.28-.621.623.008.343.273.623.618.623.188 0 .348-.06.44-.158.097.097.252.158.441.158.344 0 .62-.285.62-.623-.009-.344-.28-.62-.619-.623zm-.895-3.74c.32.187.688.276 1.106.275.414 0 .807-.093 1.178-.282.17-.09.333-.203.455-.337.225-.32.33-.733.295-1.157-.072-.9-.705-1.634-1.58-1.793-.52-.093-1.042-.01-1.5.242-.25.14-.45.327-.593.556-.15.24-.246.557-.27.898-.015.26.015.54.105.827.17.55.62.98 1.184 1.14.1.03.208.05.318.068zm2.21 1.255c-.15-.01-.29-.04-.42-.1-.26-.12-.43-.315-.46-.577a1.59 1.59 0 0 1-.03-.618c.12-.49.42-.88.795-1.095.32-.183.716-.242 1.095-.176.275.05.524.166.735.336.19.154.34.352.44.58.11.25.166.522.17.8-.005.37-.14.727-.406 1.063-.28.345-.716.565-1.21.505-.355-.045-.655-.2-.875-.48-.12-.15-.19-.33-.23-.51-.02-.08-.03-.17-.044-.254-.02-.1-.04-.2-.06-.3zM12 1.608v2.053c.225.015.44.06.64.124.35.12.616.35.77.63.17.3.25.63.23.96-.02.35-.12.69-.285.99-.18.32-.46.58-.805.76-.38.2-.836.26-1.27.18-.32-.06-.61-.18-.86-.34-.28-.19-.5-.45-.64-.75-.15-.34-.21-.73-.18-1.11.04-.48.23-.94.55-1.32.3-.35.75-.57 1.23-.61.12-.01.24-.02.36-.02v-.16c0-.32-.03-.64-.09-.96a2.08 2.08 0 0 0-.7-.76 2.46 2.46 0 0 0-1.03-.37zM9.196.938C8.612.45 7.835.123 6.98.074 6.12.025 5.29.182 4.56.548c-.69.348-1.21.84-1.46 1.41-.25.57-.31 1.21-.18 1.82.13.61.44 1.17.88 1.59.39.37.89.64 1.43.76.54.12 1.1.11 1.62-.03.44-.12.84-.34 1.17-.62.33-.28.58-.63.73-1.02.16-.42.22-.88.17-1.33-.04-.35-.13-.69-.27-1.01-.14-.33-.34-.63-.59-.89-.25-.26-.56-.46-.9-.59-.31-.12-.66-.19-1.02-.2zM5.196 22.03c.14.01.28.01.43.01.48 0 .95-.08 1.39-.23.58-.21 1.08-.55 1.44-.98.38-.45.63-1 .73-1.58.1-.6.04-1.22-.17-1.8-.22-.6-.59-1.13-1.05-1.52-.46-.38-1.03-.63-1.62-.73-.59-.1-1.2-.03-1.75.22-.5.23-.92.57-1.22 1-.3.42-.48.93-.52 1.46-.03.41.02.83.12 1.24.11.43.32.82.6 1.15.3.35.68.62 1.12.79.36.14.75.22 1.14.21zm9.85-2.53c-.22.39-.52.71-.87.95-.4.27-.88.42-1.38.45-.42.03-.85-.02-1.25-.15-.4-.13-.75-.35-1.03-.63-.28-.28-.47-.64-.56-1.03-.09-.39-.07-.8.06-1.18.13-.4.37-.75.69-1.02.32-.28.73-.46 1.17-.53.44-.07.9-.02 1.32.13.4.15.75.39 1.02.71.11.17.2.35.26.54.06.19.08.38.08.58-.01.32-.1.63-.31.91z"/></svg>,
		python:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z"/></svg>,
		java:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8.851 18.565c-.391.453-.899.767-1.288.898-.352.118-.747.176-1.043.158l-.789-1.956s-.535.131-1.183.131c-.506 0-.97-.072-1.254-.317-.273-.236-.391-.566-.391-.774 0-.343.169-.632.308-.734.181-.139.489-.253.772-.305l.655-.146c.579-.152.839-.232 1.183-.439.437-.262.766-.689.766-1.341 0-.814-.662-1.106-1.607-1.106-.512 0-1.04.099-1.381.168l-.782-.902c.237-.232.606-.448 1.136-.566.679-.152 1.113-.129 1.969-.014.182.022.341.048.451.063.11.015.195.043.293.07l.263-.133c-.182-.133-.341-.214-.512-.266a3.38 3.38 0 0 0-.635-.133c-.512-.072-1.044.066-1.371.217-.298.139-.57.336-.732.555l-.447-.512c.237-.295.548-.524.932-.658.5-.174 1.063-.222 1.573-.139.318.051.635.135.932.237l.305.137.305-.16a2.234 2.234 0 0 1-.354-.328c-.182-.202-.298-.425-.372-.649-.091-.266-.152-.557-.152-.879 0-.695.272-1.263.646-1.548.359-.273.839-.401 1.27-.401.256 0 .533.036.865.108l.402.164.263.158c-.215.15-.401.337-.571.551-.34.428-.571 1.013-.571 1.548 0 .763.295 1.32.743 1.626.263.176.621.305.952.376.348.075.733.108 1.056.108.512 0 1.113-.084 1.572-.262.503-.195.87-.524.994-.883l.419.188c-.21.403-.587.773-1.048.992-.545.257-1.172.385-1.779.385-.401 0-.831-.059-1.188-.165z"/></svg>,
		mysql:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0z"/></svg>,
		django:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z"/></svg>,
		tailwind:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"/></svg>,
		typescript:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zM17.363 9.75h-9.238v2.156h5.405v1.654h-5.405v2.154h8.635v2.174h-11.13V7.594h11.13z"/></svg>,
		spring:<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6.49 19.04h-.23L5.13 17.9v-.23l1.73-1.71h1.2l.15.15v1.2L6.5 19.04ZM5.13 6.31V6.1l1.13-1.13h.23L8.2 6.68v1.2l-.15.15h-1.2L5.13 6.31Zm9.96 9.09h-1.65l-.14-.13v-3.83c0-.68-.27-1.2-1.1-1.23-.42 0-.9 0-1.43.02l-.07.08v4.96l-.14.14H8.9l-.13-.14V8.73l.13-.14h3.7a2.6 2.6 0 0 1 2.61 2.6v4.08l-.13.14Zm-8.37-2.44H.14L0 12.82v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14Zm17.14 0h-6.58l-.14-.14v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14zM11.05 6.55V1.64l.14-.14h1.65l.14.14v4.9l-.14.14h-1.65l-.14-.13Zm0 15.81v-4.9l.14-.14h1.65l.14.13v4.91l-.14.14h-1.65l-.14-.14z"/></svg>
	};
	return icons[type]||null;
};

function FloatingIcons(){
	const icons=[
		{type:"html",top:5,left:10,scale:0.6}, {type:"css",top:15,left:25,scale:0.7}, {type:"js",top:10,left:40,scale:0.5}, {type:"react",top:25,left:55,scale:0.8},
		{type:"python",top:35,left:15,scale:0.6}, {type:"java",top:45,left:30,scale:0.7}, {type:"mysql",top:55,left:50,scale:0.5}, {type:"django",top:65,left:20,scale:0.6},
		{type:"tailwind",top:75,left:40,scale:0.7}, {type:"typescript",top:85,left:60,scale:0.5}, {type:"spring",top:20,left:70,scale:0.6}
	];
	return (
		<div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
			{icons.map((icon,i)=>(
				<div key={icon.type} className={`absolute floating-icon-${i%3===0?"":i%3===1?"delay-1":"delay-2"}`} style={{top:`${icon.top}%`,left:`${icon.left}%`,transform:`scale(${icon.scale})`,opacity:0.12}}>
					<TechIcon type={icon.type} className="w-12 h-12 text-white"/>
				</div>
			))}
		</div>
	);
}

const fadeUp = {
	hidden:{opacity:0,y:32},
	show:(i=0)=>({
		opacity:1,
		y:0,
		transition:{duration:.7,delay:i*.12,ease:[0.22,1,0.36,1]}
	})
};

const projects = [
	{
		title:"Student Management System",
		desc:"Console-based Student Management System built with Java and MySQL, with full CRUD for students, courses, enrollments, and grades using OOP architecture and the DAO pattern.",
		tags:["Java","MySQL","CRUD","DAO","OOP"],
		url:"https://github.com/zakariaelqannaa-dv/student-management",
		image:"student-project.png"
	},
	{
		title:"Hospital Management System",
		desc:"Comprehensive web-based hospital management system built with Spring Boot 4.0.5 and Java 21 for patient registration, doctor management, and appointment workflows.",
		tags:["Spring Boot","Java 21","Backend","Healthcare"],
		url:"https://github.com/zakariaelqannaa-dv/Hosp-System",
		image:"hospital-project.png"
	},
	{
		title:"Gango",
		desc:"Self-hosted music streaming app built with Django featuring uploads, playlists, favorites, search, and user authentication.",
		tags:["Django","Python","Music App","Authentication"],
		url:"https://github.com/zakariaelqannaa-dv/Gango",
		image:"gango-project.png"
	},
	{
		title:"Luxury E-commerce",
		desc:"Multi-language luxury e-commerce web application built with Django, featuring elegant storefront design, favorites, interactive search, and cart functionality.",
		tags:["Django","E-commerce","Multilingual","UI/UX"],
		url:"https://github.com/zakariaelqannaa-dv/E-commerce",
		image:"luxury-project.png"
	}
];

const certificates = [
	{
		title:"Programming Techniques",
		hours:52,
		completed:"December 01, 2025",
		area:"Software Developer",
		code:"FQ6ON8LG"
	},
	{
		title:"Programmer Java",
		hours:100,
		completed:"January 27, 2026",
		area:"Software Developer",
		code:"LHQDIU9A"
	},
	{
		title:"Programmer C#",
		hours:80,
		completed:"March 24, 2026",
		area:"Software Developer",
		code:"PO8B3HVS"
	},
	{
		title:"Database MySQL",
		hours:40,
		completed:"March 24, 2026",
		area:"Database Administrator",
		code:"DHRVOOCC"
	},
	{
		title:"Programmer Python",
		hours:70,
		completed:"2026",
		area:"Software Developer",
		code:"HT2Q48EN"
	}
];

const stack = ["HTML","CSS","JavaScript","TypeScript","Java","C#","Spring Boot","Python","Django","React","Next.js","SQL","MySQL","Tailwind"];

const skills = [
	{name:"Java",level:90,category:"Backend"},
	{name:"Django",level:85,category:"Backend"},
	{name:"Spring Boot",level:80,category:"Backend"},
	{name:"Python",level:85,category:"Backend"},
	{name:"C#",level:75,category:"Backend"},
	{name:"MySQL",level:82,category:"Database"},
	{name:"SQL",level:80,category:"Database"},
	{name:"React",level:70,category:"Frontend"},
	{name:"HTML/CSS",level:88,category:"Frontend"},
	{name:"JavaScript",level:78,category:"Frontend"},
	{name:"TypeScript",level:65,category:"Frontend"},
	{name:"Tailwind",level:75,category:"Frontend"}
];

function FloatingSkillPill({skill,index}){
	const ref=useRef(null);
	const[mousePos,setMousePos]=useState({x:0,y:0});
	
	const handleMouseMove=(e)=>{
		if(!ref.current)return;
		const rect=ref.current.getBoundingClientRect();
		const x=(e.clientX-rect.left-rect.width/2)/15;
		const y=(e.clientY-rect.top-rect.height/2)/15;
		setMousePos({x:-y,y:x});
	};
	
	const handleMouseLeave=()=>setMousePos({x:0,y:0});
	
	return(
		<motion.span
			ref={ref}
			initial={{opacity:0,y:20}}
			whileInView={{opacity:1,y:0}}
			viewport={{once:true}}
			transition={{delay:index*.05,duration:.5}}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			animate={{rotateX:mousePos.x,rotateY:mousePos.y}}
			className="cursor-pointer rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
		>
			{skill.name}
		</motion.span>
	);
}

function SkillBar({skill,index}){
	const[isInView,setIsInView]=useState(false);
	const barRef=useRef(null);
	
	useEffect(()=>{
		const observer=new IntersectionObserver(
			([entry])=>{if(entry.isIntersecting)setIsInView(true)},
			{threshold:.5}
		);
		if(barRef.current)observer.observe(barRef.current);
		return()=>observer.disconnect();
	},[]);
	
	return(
		<div ref={barRef} className="space-y-2">
			<div className="flex justify-between text-sm">
				<span className="text-white/70 font-medium">{skill.name}</span>
				<span className="text-cyan-300/90 font-medium">{skill.level}%</span>
			</div>
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
				<motion.div
					initial={{width:0}}
					animate={isInView?{width:`${skill.level}%`}:{width:0}}
					transition={{duration:1,delay:index*.1,ease:"easeOut"}}
					className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
				/>
			</div>
		</div>
	);
}

function ParallaxSection({children,offset=20}){
	const ref=useRef(null);
	const{clientX,clientY}=useMousePosition();
	const[x,y]=useMotionValue(0,0);
	const[isHovered,setIsHovered]=useState(false);
	
	useEffect(()=>{
		if(!ref.current)return;
		const rect=ref.current.getBoundingClientRect();
		const centerX=rect.left+rect.width/2;
		const centerY=rect.top+rect.height/2;
		const xVal=((clientX-window.innerWidth/2)-centerX)/(window.innerWidth)*offset;
		const yVal=((clientY-window.innerHeight/2)-centerY)/(window.innerHeight)*offset;
		x.set(xVal);
		y.set(yVal);
	},[clientX,clientY,offset]);
	
	return(
		<motion.div
			ref={ref}
			style={{x,y}}
		>
			{children}
		</motion.div>
	);
}

const profile = {
	name:"Zakaria Dev",
	title:"Software Developer",
	location:"Rome, Italy",
	availability:"Available immediately",
	linkedin:"https://www.linkedin.com/in/zakaria-elqannaa-33293b327/",
	github:"https://github.com/zakariaelqannaa-dv",
	email:"zakariaelqannaadv@gmail.com"
};

function runComponentTests(){
	const tests = [
		{
			name:"projects is a non-empty array",
			pass:Array.isArray(projects) && projects.length >= 3
		},
		{
			name:"every project has title, desc, tags, and github url",
			pass:projects.every(project=>typeof project.title === "string" && project.title.trim() && typeof project.desc === "string" && project.desc.trim() && Array.isArray(project.tags) && project.tags.length > 0 && typeof project.url === "string" && project.url.startsWith("https://github.com/"))
		},
		{
			name:"stack contains core backend skills",
			pass:stack.includes("Java") && stack.includes("Django") && stack.includes("Spring Boot") && stack.includes("MySQL")
		},
		{
			name:"fadeUp has hidden and show states",
			pass:Boolean(fadeUp && fadeUp.hidden && typeof fadeUp.show === "function")
		},
		{
			name:"linkedin url is valid",
			pass:typeof profile.linkedin === "string" && profile.linkedin.startsWith("https://www.linkedin.com/")
		},
		{
			name:"github url is valid",
			pass:typeof profile.github === "string" && profile.github.startsWith("https://github.com/")
		},
		{
			name:"certificates array has 5 items",
			pass:Array.isArray(certificates) && certificates.length === 5
		},
		{
			name:"every certificate has valid fields",
			pass:certificates.every(cert=>typeof cert.title === "string" && cert.title.trim() && typeof cert.hours === "number" && cert.hours > 0 && typeof cert.completed === "string" && cert.completed.trim() && typeof cert.area === "string" && cert.area.trim() && typeof cert.code === "string" && cert.code.trim())
		},
		{
			name:"python certificate exists",
			pass:certificates.some(cert=>cert.title === "Programmer Python" && cert.code === "HT2Q48EN" && cert.hours === 70)
		}
	];
	if(typeof console !== "undefined"){
		tests.forEach(test=>console.assert(test.pass, `[portfolio-test] ${test.name}`));
	}
	return tests;
}

const componentTests = runComponentTests();

function renderProjectTag(tag){
	return <span key={tag} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 font-medium">{tag}</span>;
}

function renderStackItem(item){
	return <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/82">{item}</span>;
}

function ProjectCard({project,index}){
	const cardRef=useRef(null);
	const[mousePosition,setMousePosition]=useState({x:0,y:0});
	
	const handleMouseMove=(e)=>{
		if(!cardRef.current)return;
		const rect=cardRef.current.getBoundingClientRect();
		const x=(e.clientX-rect.left)/rect.width-.5;
		const y=(e.clientY-rect.top)/rect.height-.5;
		setMousePosition({x:y*.5,y:-x*.5});
	};
	
	const handleMouseLeave=()=>setMousePosition({x:0,y:0});
	
	return (
		<motion.div
			ref={cardRef}
			key={project.title}
			initial="hidden"
			whileInView="show"
			viewport={{once:true,amount:.2}}
			variants={fadeUp}
			custom={index}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{transform:`perspective(1000px) rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,transition:"transform 0.15s"}}
			className="group rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-cyan-500/5"
		>
			<div className="mb-5 overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-gradient-to-br from-[#0d1730] via-[#111b3a] to-[#0a1226] p-3 relative">
				<div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
				{project.image ? (
					<img src={project.image} alt={project.title} className="h-72 w-full rounded-[1rem] object-cover shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-cyan-500/20" loading="lazy" />
				) : (
					<div className="h-72 rounded-[1rem]" />
				)}
			</div>
			<h3 className="text-xl font-medium tracking-[-0.02em] text-white">{project.title}</h3>
			<p className="mt-3 text-sm leading-6 text-white/55">{project.desc}</p>
			<div className="mt-5 flex flex-wrap gap-2">{project.tags.map(renderProjectTag)}</div>
			<a href={project.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-300 transition-all group-hover:gap-3 group-hover:text-cyan-200">
				Open Project
				<ExternalLinkIcon className="h-4 w-4" />
			</a>
		</motion.div>
	);
}

function CertificateCard({certificate,index}){
	const cardRef=useRef(null);
	const[mousePosition,setMousePosition]=useState({x:0,y:0});
	
	const handleMouseMove=(e)=>{
		if(!cardRef.current)return;
		const rect=cardRef.current.getBoundingClientRect();
		const x=(e.clientX-rect.left)/rect.width-.5;
		const y=(e.clientY-rect.top)/rect.height-.5;
		setMousePosition({x:y*.5,y:-x*.5});
	};
	
	const handleMouseLeave=()=>setMousePosition({x:0,y:0});
	
	return (
		<motion.div
			ref={cardRef}
			initial="hidden"
			whileInView="show"
			viewport={{once:true,amount:.2}}
			variants={fadeUp}
			custom={index}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{transform:`perspective(1000px) rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,transition:"transform 0.15s"}}
			className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:-translate-y-1"
		>
			<div className="flex items-center justify-between">
				<div className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">CEFI</div>
				<div className="text-xs text-white/30">{certificate.hours}h</div>
			</div>
			<h3 className="mt-4 text-lg font-medium tracking-[-0.02em] text-white">{certificate.title}</h3>
			<div className="mt-4 space-y-2 text-xs text-white/50">
				<p><span className="text-white/60">Completed:</span> {certificate.completed}</p>
				<p><span className="text-white/60">Area:</span> {certificate.area}</p>
				<p><span className="text-white/60">Code:</span> <span className="font-mono text-cyan-300/60">{certificate.code}</span></p>
			</div>
		</motion.div>
	);
}

export default function AnimatedFrontendPortfolio(){
	const[showSplash,setShowSplash]=useState(true);
	
	return (
		<>
		<AnimatePresence>
			{showSplash && <SplashScreen onComplete={()=>setShowSplash(false)} key="splash" />}
		</AnimatePresence>
		<div className={`min-h-screen overflow-x-hidden bg-[#050816] text-white selection:bg-cyan-500/30 ${showSplash?"hidden":"block"}`}>
			<CustomCursor />
			<AnimatedBackground />
			<div className="fixed inset-0 pointer-events-none -z-10">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
			</div>
			<div className="grain-overlay" />

<header className="sticky top-0 z-50 border-b border-white/[0.02] glass bg-[#050816]/40 backdrop-blur-sm">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
					<motion.a initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-lg font-bold tracking-[0.12em] text-white hover:text-cyan-200 transition-colors" href="#home">
						<span className="text-gradient">{profile.name}</span>
					</motion.a>
					<nav className="hidden gap-8 text-sm md:flex">
						<a className="relative text-white/70 hover:text-white transition-colors group" href="#about">
							About
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
						</a>
						<a className="relative text-white/70 hover:text-white transition-colors group" href="#skills">
							Skills
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
						</a>
						<a className="relative text-white/70 hover:text-white transition-colors group" href="#work">
							Work
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
						</a>
						<a className="relative text-white/70 hover:text-white transition-colors group" href="#certifications">
							Certs
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
						</a>
						<a className="relative text-white/70 hover:text-white transition-colors group" href="#contact">
							Contact
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
						</a>
					</nav>
					<a href="#contact" className="rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-5 py-2 text-sm font-medium text-cyan-200 transition-all hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
						Let's Talk
					</a>
				</div>
			</header>

			<section id="home" className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 lg:px-10">
				<div className="grid w-full gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
					<div>
						<motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
								<span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300"></span>
							</span>
							{profile.title}
						</motion.div>
						<motion.h1 initial="hidden" animate="show" variants={fadeUp} custom={1} className="max-w-4xl text-5xl font-bold leading-[.88] tracking-[-0.03em] text-white md:text-7xl lg:text-6.5xl text-gradient text-glow">
							Building polished software, backend systems & modern web experiences.
						</motion.h1>
						<motion.p initial="hidden" animate="show" variants={fadeUp} custom={2} className="mt-7 max-w-2xl text-lg leading-8 text-white/60">
							I am Zakaria, a Software Developer based in Rome, Italy, focused on Java, C#, MySQL, Spring Boot, Django, and TypeScript. I build systems that combine strong backend structure with modern interfaces.
						</motion.p>
						<div className="mt-6 flex flex-wrap gap-3">
							<span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/60">
								<svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
								{profile.location}
							</span>
							<span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 pulse-glow">
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
								{profile.availability}
							</span>
						</div>
						<motion.div initial="hidden" animate="show" variants={fadeUp} custom={3} className="mt-10 flex flex-wrap gap-4">
							<a href="#work" className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] btn-glow overflow-hidden">
								<span className="relative z-10 flex items-center gap-2">
									View Projects
									<ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
								</span>
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet-500 via-cyan-500 to-blue-500 transition-transform duration-300 group-hover:translate-x-0 opacity-0 group-hover:opacity-20"/>
							</a>
							<a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
								Contact Me
							</a>
						</motion.div>
					</div>

					<motion.div 
						initial={{opacity:0,scale:.96,y:30}} 
						animate={{
							opacity:1,
							scale:1,
							y:[0,-10,0],
						}} 
						transition={{
							y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
							opacity: { duration: 1, delay: 0.3 },
							scale: { duration: 1, delay: 0.3 }
						}} 
						className="relative mx-auto w-full max-w-[540px]"
					>
						<div className="absolute -inset-12 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-fuchsia-500/30 blur-[50px]" />
						<motion.div 
							whileHover={{ scale: 1.02, rotateY: 3, rotateX: -3 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl"
						>
							<div className="overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0a0f1c]">
								<div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
									<div className="flex gap-1.5">
										<div className="h-3 w-3 rounded-full bg-red-500/80" />
										<div className="h-3 w-3 rounded-full bg-yellow-500/80" />
										<div className="h-3 w-3 rounded-full bg-green-500/80" />
									</div>
									<div className="text-xs text-white/40 font-mono">main.js</div>
								</div>
								<div className="space-y-4 p-5 font-mono text-sm">
									<div className="flex gap-2">
										<span className="text-purple-400">import</span>
										<span className="text-white">React</span>
										<span className="text-white/50">from</span>
										<span className="text-cyan-300">"react"</span>;
									</div>
									<div className="flex gap-2">
										<span className="text-purple-400">const</span>
										<span className="text-white">App</span>
										<span className="text-white/50">=</span>
										<span className="text-purple-400">()</span>
										<span className="text-white">=></span>
										<span className="text-purple-400">{'{'}</span>
									</div>
									<div className="pl-4 border-l-2 border-cyan-500/30 space-y-2">
										<div className="flex gap-2">
											<span className="text-purple-400">return</span>
											<span className="text-white">(</span>
										</div>
										<div className="pl-4 flex gap-2">
											<span className="text-white">&lt;</span>
											<span className="text-fuchsia-400">div</span>
											<span className="text-white">className=</span>
											<span className="text-cyan-300">"app"</span>
											<span className="text-white">&gt;</span>
										</div>
										<div className="pl-8 text-white/60">{/* Your Code */}</div>
										<div className="pl-4 flex gap-2">
											<span className="text-white">&lt;/</span>
											<span className="text-fuchsia-400">div</span>
											<span className="text-white">&gt;</span>
										</div>
										<div className="pl-4 flex gap-2">
											<span className="text-purple-400">)</span>;
										</div>
									</div>
									<div className="text-purple-400">};</div>
								</div>
							</div>
							<div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-xs font-medium text-white shadow-lg">
								Live Code
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			<section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
				<div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
					<motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl">
						<div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">About</div>
						<h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Student developer with a backend-first mindset.</h2>
					</motion.div>
					<motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} custom={1} className="rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-8 text-white/60 backdrop-blur-xl">
						<p className="text-base leading-8">
							I am a passionate and motivated Software Developer based in Rome, Italy, with a strong foundation in Java, C#, and MySQL. I completed certified CEFI training across Programming Techniques, Java, C#, and Database MySQL. I am currently looking for professional opportunities as a Software Developer or stage/tirocinio position in Rome or surrounding areas.
						</p>
						<div className="mt-8 flex flex-wrap gap-2.5">{stack.map(renderStackItem)}</div>
					</motion.div>
				</div>
			</section>

			<section id="skills" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
				<motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="mb-14">
					<div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Skills</div>
					<h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Technologies I work with.</h2>
				</motion.div>
				<div className="grid gap-14 lg:grid-cols-2">
					<div className="space-y-6">
						<h3 className="text-lg font-medium text-white flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-cyan-400"/>
							Backend & Languages
						</h3>
						<div className="space-y-5">
							{skills.filter(s=>s.category==="Backend"||s.category==="Database").map((skill,index)=><SkillBar key={skill.name} skill={skill} index={index}/>)}
						</div>
					</div>
					<div className="space-y-6">
						<h3 className="text-lg font-medium text-white flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-violet-400"/>
							Frontend & Tools
						</h3>
						<div className="space-y-5 mb-8">
							{skills.filter(s=>s.category==="Frontend").map((skill,index)=><SkillBar key={skill.name} skill={skill} index={index+6}/>)}
						</div>
						<div className="flex flex-wrap gap-3">
							{skills.map((skill,index)=><FloatingSkillPill key={skill.name} skill={skill} index={index}/>)}
						</div>
					</div>
				</div>
			</section>

			<section id="work" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
				<motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="mb-12">
					<div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Selected Work</div>
					<h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Projects from my GitHub.</h2>
				</motion.div>
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{projects.map((project,index)=><ProjectCard key={project.title} project={project} index={index} />)}</div>
				<motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fadeUp} custom={4} className="mt-12 text-center">
					<a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10">
						View All Projects on GitHub <ArrowRightIcon className="h-4 w-4" />
					</a>
				</motion.div>
			</section>

			<section id="certifications" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
				<motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="mb-14">
					<div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Certifications</div>
					<h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">CEFI certified training.</h2>
				</motion.div>
				<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{certificates.map((certificate,index)=><CertificateCard key={certificate.code} certificate={certificate} index={index} />)}</div>
				<motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fadeUp} custom={5} className="mt-10 text-center">
					<p className="text-sm text-white/40">Verification codes can be verified at CEFI</p>
				</motion.div>
			</section>

			<section id="contact" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
				<motion.div initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={fadeUp} className="relative rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-8 md:p-12 backdrop-blur-2xl overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/20 to-transparent blur-3xl pointer-events-none"/>
					<div className="grid gap-12 lg:grid-cols-2 relative">
						<div>
							<div className="text-sm uppercase tracking-[0.25em] text-cyan-200/80">Contact</div>
							<h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Let's build something amazing together.</h2>
							<p className="mt-6 max-w-xl text-base leading-7 text-white/55">
								I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Let's create something exceptional.
							</p>
							<div className="mt-8 flex flex-wrap gap-4">
								<a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"><GitHubIcon className="h-4 w-4" />GitHub</a>
								<a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-blue-500/50 hover:bg-blue-500/15 hover:text-blue-200 hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]"><LinkedInIcon className="h-4 w-4" />LinkedIn</a>
								<a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-violet-500/50 hover:bg-violet-500/15 hover:text-violet-200 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)]"><MailIcon className="h-4 w-4" />Email</a>
							</div>
						</div>
						<ContactForm email={profile.email} />
					</div>
				</motion.div>
			</section>

			<div className="sr-only" aria-hidden="true">{componentTests.map(test=>`${test.name}:${test.pass ? "pass" : "fail"}`).join("|")}</div>
			
			<footer className="border-t border-white/[0.06] bg-[#050816]/80 backdrop-blur-xl">
				<div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
					<div className="flex flex-col items-center justify-between gap-8 md:flex-row">
						<div className="flex flex-wrap justify-center gap-8 text-sm">
							<a className="relative text-white/50 hover:text-cyan-200 transition-colors group" href="#about">
								About
								<span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
							</a>
							<a className="relative text-white/50 hover:text-cyan-200 transition-colors group" href="#skills">
								Skills
								<span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
							</a>
							<a className="relative text-white/50 hover:text-cyan-200 transition-colors group" href="#work">
								Work
								<span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
							</a>
							<a className="relative text-white/50 hover:text-cyan-200 transition-colors group" href="#certifications">
								Certs
								<span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
							</a>
							<a className="relative text-white/50 hover:text-cyan-200 transition-colors group" href="#contact">
								Contact
								<span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 group-hover:w-full"/>
							</a>
						</div>
						<div className="flex items-center gap-4">
							<a href={profile.github} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
								<GitHubIcon className="h-5 w-5" />
							</a>
							<a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
								<LinkedInIcon className="h-5 w-5" />
							</a>
						</div>
					</div>
					<div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
						<div className="text-xs text-white/25">
							&copy; {new Date().getFullYear()} <span className="text-gradient">{profile.name}</span>. Built with React & Tailwind.
						</div>
					</div>
				</div>
			</footer>
		</div>
		</>
	);
}

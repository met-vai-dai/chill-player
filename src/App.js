import React, { useState, useRef } from 'react';
// Import styles
import './styles/app.scss';
// Adding components
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import Nav from './components/Nav';
// Import data
import data from './data';
import LibrarySong from './components/LibrarySong';

function App() {
	// Ref
	const audioRef = useRef(null);
	// State
	const [songs, setSongs] = useState(data());
	const [currentSong, setCurrentSong] = useState(songs[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [songInfo, setSongInfo] = useState({
		currentTime: 0,
		duration: 0,
		animationPercenage: 0,
	});
	const [libraryStatus, setLibraryStatus] = useState(false);

	// Handlers
	const timeUpdateHandler = (e) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;
		// Calculate percentage
		const roundedCurrent = Math.round(current);
		const roundedDuration = Math.round(duration);
		const animation = Math.round((roundedCurrent / roundedDuration) * 100);

		setSongInfo({
			...songInfo,
			currentTime: current,
			duration,
			animationPercentage: animation,
		});
	};

	const songEndHandler = async () => {
		let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
		await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
		if (isPlaying) audioRef.current.play();
	};

	return (
		<div className={`App ${libraryStatus ? 'library-active' : ''}`}>
			<Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
			<Song isPlaying={isPlaying} currentSong={currentSong} />
			<Player
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
				currentSong={currentSong}
				audioRef={audioRef}
				setSongInfo={setSongInfo}
				songInfo={songInfo}
				songs={songs}
				setSongs={setSongs}
				setCurrentSong={setCurrentSong}
			/>
			<Library
				libraryStatus={libraryStatus}
				isPlaying={isPlaying}
				songs={songs}
				setCurrentSong={setCurrentSong}
				audioRef={audioRef}
				setSongs={setSongs}
			/>
			<audio
				onLoadedMetadata={timeUpdateHandler}
				onTimeUpdate={timeUpdateHandler}
				ref={audioRef}
				src={currentSong.audio}
				onEnded={songEndHandler}
			></audio>
		</div>
	);
}

export default App;

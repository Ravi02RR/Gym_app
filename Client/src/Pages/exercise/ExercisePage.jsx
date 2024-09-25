/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback, useRef } from "react";
import { PlayCircle, Search, X } from "lucide-react";
import YouTube from "react-youtube";
import debounce from 'lodash.debounce';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-gray-800 p-4 rounded-lg relative max-w-3xl w-full h-full object-contain">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-gray-300"
                >
                    <X size={24} />
                </button>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const ExercisePage = () => {
    const [exercises, setExercises] = useState([]);
    const [displayedExercises, setDisplayedExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const observer = useRef();
    const ITEMS_PER_PAGE = 9;

    const lastExerciseElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        filterExercises();
    }, [exercises, searchTerm, selectedCategory, page]);

    const fetchExercises = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:3000/getExercise");
            const data = await response.json();
            setExercises(data.exercises);
        } catch (err) {
            console.error("Error fetching exercises:", err);
            setError("Failed to load exercises. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const filterExercises = () => {
        let filtered = exercises;

        if (searchTerm) {
            filtered = filtered.filter(exercise =>
                exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter(exercise => exercise.category === selectedCategory);
        }

        setHasMore(filtered.length > page * ITEMS_PER_PAGE);
        setDisplayedExercises(filtered.slice(0, page * ITEMS_PER_PAGE));
    };

    const handleSearch = debounce((term) => {
        setSearchTerm(term);
        setPage(1);
    }, 300);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const getYoutubeId = (url) => {
        // eslint-disable-next-line no-useless-escape
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const openVideoModal = (videoId) => {
        setSelectedVideo(videoId);
        setModalOpen(true);
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
        setModalOpen(false);
    };

    const categories = ["All", ...new Set(exercises.map(exercise => exercise.category))];

    if (error) {
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        className="w-full bg-gray-700 text-white rounded-full py-2 px-4 pl-10"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <select
                    className="bg-gray-700 text-white rounded-full py-2 px-4"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    value={selectedCategory}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {displayedExercises.length === 0 && !isLoading ? (
                <p className="text-center">No exercises found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {displayedExercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                            ref={index === displayedExercises.length - 1 ? lastExerciseElementRef : null}
                        >
                            <div className="aspect-w-16 aspect-h-9">
                                <YouTube
                                    videoId={getYoutubeId(exercise.youtube_link)}
                                    opts={{
                                        width: '100%',
                                        height: '100%',
                                        playerVars: {
                                            autoplay: 0,
                                        },
                                    }}
                                />
                            </div>
                            <div className="p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-2">{exercise.name}</h2>
                                <p className="text-gray-400 mb-2">
                                    <span className="font-semibold">Category:</span> {exercise.category}
                                </p>
                                <p className="text-gray-400 mb-4">
                                    <span className="font-semibold">Target:</span> {exercise.target_body_part}
                                </p>
                                <p className="text-gray-300 mb-4">{exercise.description}</p>
                                <button
                                    onClick={() => openVideoModal(getYoutubeId(exercise.youtube_link))}
                                    className="inline-flex items-center bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base"
                                >
                                    <PlayCircle className="mr-2" size={16} />
                                    Watch Full Tutorial
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isLoading && <div className="text-center mt-4">Loading more exercises...</div>}

            <Modal isOpen={modalOpen} onClose={closeVideoModal}>
                <div className="aspect-w-16 aspect-h-9">
                    <YouTube
                        videoId={selectedVideo}
                        opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: {
                                autoplay: 1,
                            },
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ExercisePage;
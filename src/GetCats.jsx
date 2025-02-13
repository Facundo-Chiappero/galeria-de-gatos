import { useEffect, useState, useRef, useId } from "react";

const GetCats = () => {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [needToScroll, setNeedToScroll] = useState(false);
    const URL = 'https://cataas.com/cat';

    const galleryRef = useRef(null);
    const lastScrollY = useRef(0);

    const fetchCats = async () => {
        try {
            const response = await fetch(URL);
            const imageUrl = response.url;
            setCats(prevCats => [...prevCats, imageUrl]);

            if(count >= 5) {
                setNeedToScroll(true);
            }
        } catch (error) {
            console.error('Error al buscar la imagen:', error);
        }
    };

    const handleUserScroll = () => {
        if (galleryRef.current) {
            lastScrollY.current = galleryRef.current.scrollTop;
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (count < 5) {
                fetchCats();
                setCount(count + 1);
                console.log(count);
            } else {
                clearInterval(intervalId);
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [count]);

    useEffect(() => {
        if (cats.length > 0) {
            setLoading(false);
        }
    }, [cats]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [needToScroll]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className="galeria" ref={galleryRef} onScroll={handleUserScroll}>
                        {cats.map((cat, index) => (
                            <img key={index} src={cat} alt="Gato" />
                        ))}
                    </div>
                    <button onClick={fetchCats}>Cargar más gatos</button>
                </div>
            )}
        </div>
    );
};

export default GetCats;

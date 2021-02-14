import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';

import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // get total list
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // get featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
        if (window.scrollY > 10) {
          setBlackHeader(true);
        } else {
          setBlackHeader(false);
        }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }

  }, []);

  return (
    <div className='page'>

      <Header black={blackHeader}/>

      {featureData &&
        <FeaturedMovie item={featureData}/>
      }
      
      <section className='lists'>
        {movieList.map((item, i) => (
          <div key={i}>
            <MovieRow title={item.title} items={item.items}/>
          </div>
        ))}
      </section>

      <footer>
        <p>
          Feito por jpzuaneti <span role='img' arial-label='Obrigado'>👊🏽</span><br/> 
          Direitos de imagem para <span className='red'>Netiflix</span> <br/>
          Dados pegos de <a href='https://www.themoviedb.org/'>themoviedb.org</a>
        </p>
      </footer>

      {movieList.length <= 0 &&
        <div className='loading'>
          <img src='https://media.filmelier.com/news/br/2020/03/Netflix_LoadTime.gif' alt='Carregando' />
        </div>
      }
    </div>
  )
}
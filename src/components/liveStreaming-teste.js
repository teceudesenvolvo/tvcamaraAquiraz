import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const YouTubeLive = () => {
    const [liveStreams, setLiveStreams] = useState([]);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getAccessToken();
                setAccessToken(token);

                const response = await fetchLiveStreams(token);
                setLiveStreams(response.data.items);
            } catch (error) {
                console.error('Erro ao buscar live streams:', error);
            }
        };

        fetchData();
    }, []);

    const getAccessToken = async () => {
        try {
            const tokenResponse = await axios.post(
                'https://oauth2.googleapis.com/token',
                {
                    client_id: '851732199065-gn80ftna8kh9edipf64ibq8mf73f45bc.apps.googleusercontent.com',
                    client_secret: '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',
                    refresh_token: 'ya29.a0AfB_byAtYADR-E00vweiSI2WzEy6Ri3yxOeg2H0WBN9S2jcB50vCngpIckWKqOSLOuf6aUA7vr0y8OTvYlybqX0rHSt8xq-hUyy3gyPwQgWgNGrLw30fXdik_8mLk16zsL9p1m6Hg5FSLX0gz9EY0nfKwQmSkS7xQZhHaCgYKAdUSARMSFQHGX2Mi1gVJFAFXQ5oFAriT7ntTtg0171',
                    grant_type: 'refresh_token',
                }
            );
            return tokenResponse.data.access_token;
        } catch (error) {
            console.error('Erro ao obter access token:', error);
            throw error;
        }
    };

    const fetchLiveStreams = (accessToken) => {

        const API_KEY = 'AIzaSyCfZfFR3QzWmQWBYMgwmXx8n2EdyjdFi2s';
        const CHANNEL_ID = '$UCjxnvUBYTWsp_zmkFKOvkQA';

        return axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          ).then(response => {
            return response.data.items;
          }).catch(error => {
            console.error('Erro ao buscar live streams:', error);
            throw error;
          });

    };

    return (
        <div>
            <h1>Live Streams do Meu Canal do YouTube</h1>
            <div>
                {liveStreams.map((stream) => (
                    <div key={stream.id.videoId}>
                        <h2>{stream.snippet.title}</h2>
                        <p>{stream.snippet.description}</p>
                        <ReactPlayer className="watchVideo" scrolling="no" frameborder="0" onload="iFrameResize()"
                            url={`https://www.youtube.com/watch?v=FJgQa42w-L8`} controls='true' />

                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouTubeLive;

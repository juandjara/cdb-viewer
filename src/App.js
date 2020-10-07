import React, { useState } from 'react';
import styled from 'styled-components'
import { StaticMap } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DeckGL from '@deck.gl/react';
import { CartoSQLLayer } from '@deck.gl/carto';
import Input from './components/Input'
import Button from './components/Button'
import Alert from './components/Alert'
import Loading from './components/Loading'
import IconMenu from './components/IconMenu'

const StyledRoot = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  min-height: 100vh;

  aside {
    flex: 0 0 320px;
    background-color: white;
    z-index: 1;
    position: relative;
    box-shadow: 0 0 2px 4px rgba(0,0,0, 0.1);
    transition: transform 0.25s ease-in-out;

    .toggle-btn {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateX(100%);

      box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.1);
      padding: 8px;
      border: none;
      background-color: white;
      height: 36px;
      border-bottom-right-radius: 4px;
    }

    &.closed {
      transform: translateX(-312px);
    }

    form {
      max-height: calc(100vh);
      overflow-y: auto;
      padding: 1rem;
    }

    h2 {
      margin: 1rem 0;
      font-size: 24px;
      font-weight: 500;
    }

    textarea {
      width: 100%;
      min-height: 120px;
      font: inherit;
      padding: 8px;
      resize: vertical;
    }

    .block {
      margin-bottom: 24px;

      label {
        font-size: 14px;
        display: block;
        margin-bottom: 4px;
        color: #626775;
      }
    }
  }

  .loading {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, 0.2);
  }
`

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 2
}

const DEFAULT_CREDENTIALS = {
  username: 'public',
  apiKey: 'default_public',
  serverUrlTemplate: 'https://{user}.carto.com'
}

class SQLLayer extends CartoSQLLayer {
  async _updateTileJSON () {
    const { onError, onLoad } = this.props
    try {
      await super._updateTileJSON()
      if (typeof onLoad === 'function') {
        onLoad()
      }
    } catch (err) {
      if (typeof onError === 'function') {
        onError(err)
      } else {
        console.error(err)
      }
    }
  }
}
SQLLayer.componentName = 'SQLLayer'

function App() {
  const [layers, setLayers] = useState([])
  const [username, setUsername] = useState("")
  const [apikey, setApikey] = useState("")
  const [serverUrl, setServerUrl] = useState("")
  const [query, setQuery] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)

  const handleChange = fn => ev => fn(ev.target.value)

  function handleSubmit (ev) {
    ev.preventDefault()
    const credentials = {
      username: username || DEFAULT_CREDENTIALS.username,
      apiKey: apikey || DEFAULT_CREDENTIALS.apiKey,
      serverUrlTemplate: serverUrl || DEFAULT_CREDENTIALS.serverUrlTemplate
    }
    const layer = new SQLLayer({
      id: 'viewer',
      data: query,
      credentials,
      pointRadiusMinPixels: 6,
      getLineColor: [0, 0, 0, 0.75],
      getFillColor: [238, 77, 90],
      lineWidthMinPixels: 1,
      onError: handleError,
      onLoad: handleLoad
    })
    setLayers([layer])
    setLoading(true)
    setError(null)
  }

  function handleError (err) {
    console.error('[App.js] Error calling maps API', err)
    setError(err.toString())
    setLoading(false)
    setLayers([])
  }

  function clearError () {
    setError(null)
  }

  function handleLoad () {
    setLoading(false)
  }

  function handleToggle () {
    setOpen(!open)
  }

  return (
    <StyledRoot className="App">
      {loading && <Loading color="deepskyblue" size="80px" />}
      {error && <Alert text={error} onClose={clearError} />}
      <aside className={open ? 'open' : 'closed'}>
        <button className="toggle-btn" onClick={handleToggle}>
          <IconMenu width={20} height={20} />
        </button>
        <form onSubmit={handleSubmit}>
          <h2>Deck.GL CARTO Viewer</h2>
          <div className="block">
            <label htmlFor="username">Username</label>
            <Input
              value={username}
              onChange={handleChange(setUsername)}
              name="username"
              placeholder={DEFAULT_CREDENTIALS.username} />
          </div>
          <div className="block">
            <label htmlFor="apikey">API Key</label>
            <Input 
              value={apikey}
              onChange={handleChange(setApikey)}
              name="apikey"
              placeholder={DEFAULT_CREDENTIALS.apiKey} />
          </div>
          <div className="block">
            <label htmlFor="server_template">Server URL template</label>
            <Input
              value={serverUrl}
              onChange={handleChange(setServerUrl)}
              name="server_template"
              placeholder={DEFAULT_CREDENTIALS.serverUrlTemplate} />
          </div>
          <div className="block">
            <label htmlFor="query">SQL Query</label>
            <Input
              value={query}
              onChange={handleChange(setQuery)}
              as="textarea" name="query" />
          </div>
          <Button disabled={!query} type="submit">Update</Button>
        </form>
      </aside>
      <main id="map">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <StaticMap
            reuseMaps
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            preventStyleDiffing
          />
        </DeckGL>
      </main>
    </StyledRoot>
  );
}

export default App;

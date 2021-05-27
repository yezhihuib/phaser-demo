import React, {useEffect} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Card} from "antd";
import * as PIXI from 'pixi.js'

export const PixiJsMain = (): React.ReactNode => {

    useEffect(() => {
        const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
        document.getElementById("gamemain").appendChild(app.view);

// load the texture we need
        PIXI.Texture.fromURL("https://img.alicdn.com/imgextra/i3/57145161/O1CN01jgYJwN1nzmlSX0945_!!57145161.png").then((texture) => {
          const bunny = new PIXI.Sprite(texture);

          // Setup the position of the bunny
          bunny.x = app.renderer.width / 2;
          bunny.y = app.renderer.height / 2;

          // Rotate around the center
          bunny.anchor.x = 0.5;
          bunny.anchor.y = 0.5;

          // Add the bunny to the scene we are building.
          app.stage.addChild(bunny);

          // Listen for frame updates
          app.ticker.add(() => {
            // each frame we spin the bunny around a bit
            bunny.rotation += 0.01;
          });
        });

      }, []
    )
// const intl = useIntl();
    return (
      <PageContainer>
        <Card>
          <div id="gamemain"/>
        </Card>

      </PageContainer>
    )
  }
;


export default PixiJsMain;

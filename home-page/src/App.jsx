import React from "react";
import ReactDOM from "react-dom";


import {
    Container
} from 'shards-react'

// git에서 댕겨온 코드에는 얘가 빠져있대?
// 근데 넣으나 뺴나 뭘 별반 차이는 안 보임.
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";


import "./index.css";


// library name/App name
import Chat from "chat/Chat";


const App = () => (
    <Container>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae magna tempus, posuere enim ut, lacinia sem. Proin sollicitudin ipsum ac orci commodo, ut hendrerit eros placerat. Vivamus eget arcu nisi. Morbi pellentesque molestie nisl at tristique. Maecenas semper, justo sit amet imperdiet posuere, neque turpis bibendum massa, sed porttitor turpis nibh mattis leo. Integer sagittis lectus quis elit pulvinar, quis cursus massa sollicitudin. Nam mollis elementum mauris non rutrum. Suspendisse potenti. Vivamus tincidunt commodo orci, sit amet eleifend sem lobortis et. Quisque efficitur odio faucibus, rhoncus enim vitae, sollicitudin tellus. Nam id sapien nisi. Proin ut vestibulum eros. Sed libero leo, porttitor sit amet dolor ultricies, mollis suscipit sem. Proin vehicula nisl dolor, vel posuere turpis tempus iaculis.</p>


        
        <h1>Chat</h1>
        <Chat />
        {/* <div>Chat window will be here</div> */}


        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae magna tempus, posuere enim ut, lacinia sem. Proin sollicitudin ipsum ac orci commodo, ut hendrerit eros placerat. Vivamus eget arcu nisi. Morbi pellentesque molestie nisl at tristique. Maecenas semper, justo sit amet imperdiet posuere, neque turpis bibendum massa, sed porttitor turpis nibh mattis leo. Integer sagittis lectus quis elit pulvinar, quis cursus massa sollicitudin. Nam mollis elementum mauris non rutrum. Suspendisse potenti. Vivamus tincidunt commodo orci, sit amet eleifend sem lobortis et. Quisque efficitur odio faucibus, rhoncus enim vitae, sollicitudin tellus. Nam id sapien nisi. Proin ut vestibulum eros. Sed libero leo, porttitor sit amet dolor ultricies, mollis suscipit sem. Proin vehicula nisl dolor, vel posuere turpis tempus iaculis.</p>

    </Container>
);

ReactDOM.render(<App />, document.getElementById("app"));

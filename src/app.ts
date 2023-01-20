import './components/styles/main.scss';
import Header from './components/view/header';



class App {
  header: Header;
  constructor() {
    this.header = new Header();
  }
  start(){
    this.header.drawHeaderBlock();
  }
}

const app = new App();
app.start();
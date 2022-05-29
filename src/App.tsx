import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Modal, ModalFooter, Nav, Row } from 'react-bootstrap';
import { getElementAtEvent, Line } from 'react-chartjs-2';
import './App.css';
import './assets/css/bootstrap.min.css';
import './assets/css/icons.css';
import './assets/css/style.css';
import ChartSomo from './ChartSomo';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Data from './Data';
import io from 'socket.io-client'; 

const socket = io('http://localhost:4000');

function App() {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, 
    Filler
  );

  const [data, setData] = useState(new Array<Data>());
  const [step, setStep] = useState(0);
  const [commit, setCommit] = useState('');
  const [log, setLog] = useState(new Array<string>());
  const [chart, setChart] = useState(new ChartSomo(data));

  const [modalShow, setModalShow] = useState(false);
  const [modalData, setModalData] = useState(new Data('develop', 'commit', 0, '', ''));

  const chartRef = useRef();
  const chartClick = (e:any) => {
    if(chartRef.current) {
      let element = getElementAtEvent(chartRef.current, e);
      if(element.length > 0) {
        const idx = element[0].index;
        setModalData(data[idx]);
        setModalShow(true);
      }
    }
  };

  const appendLog = (logText : string) => {
    setLog(log => [...log, logText]);
  };


  useEffect(()=>{

    socket.on('commit', ({id}) => {
      setCommit(id);
    });

    socket.on('load', ({list}) => {
      setData(list);
    });

    socket.on('step', ({step}) => {
      setStep(step);
    });

    socket.on('log', ({log}) => {
      appendLog(log);
    });

    socket.on('appendItem', ({item}) => {
      setData(data => [...data, item]);
    });

  }, []);

  useEffect(() => {
    setChart(new ChartSomo(data));
  }, [data])



  return (
    <div className="content">

      <Modal show={modalShow} onHide={()=>setModalShow(false)}>
        <Modal.Header>
          <Modal.Title>{modalData.commit}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className='col-sm-6'>branch</Col>
            <Col className='col-sm-6'>{modalData.branch}</Col>
          </Row>
          <Row>
            <Col className='col-sm-6'>commit</Col>
            <Col className='col-sm-6'>{modalData.commit}</Col>
          </Row>
          <Row>
            <Col className='col-sm-6'>power</Col>
            <Col className='col-sm-6'>{modalData.power}</Col>
          </Row>
          <Row>
            <Col className='col-sm-6'>start time</Col>
            <Col className='col-sm-6'>{modalData.startTime}</Col>
          </Row>
          <Row>
            <Col className='col-sm-6'>end time</Col>
            <Col className='col-sm-6'>{modalData.endTime}</Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col className='col-sm-12'>
              <Button onClick={()=>setModalShow(false)} className='btn btn-gradient-success waves-effect waves-light'>Close</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Nav className='navbar-custom pt-3 pl-5 text-left'>
        <div className='text-center bg-logo'>
          <a className='logo' href='/'><i className='fa fa-bolt text-success'> SOMO</i></a>
        </div>
      </Nav>
      <div className='container-fluid pl-3 pr-3'>
        
        <Row>
          <Col className='col-sm-12'>
            <h5 className='page-title'><i className='fas fa-power-off'></i> Status</h5>
          </Col>
        </Row>
        <Row>
          <Col className='col-sm-3'></Col>
          <Col className='col-sm-6'>
            <div className={`card ${step === 0 ? 'bg-dark' : 'bg-gradient2'} text-white`}>
              <div className='card-body'>
                <h6 className='text-center text-white'>
                  <i className='fas fa-bolt text-danger'></i>
                  {step === 0 ? '최근 커밋 ID 모니터링 중...' :  '현재 테스트 동작중입니다.'}
                  <i className='fas fa-bolt text-danger'></i>
                </h6>
                <p className='text-center'>{step===0 ? '마지막' : '현재' } 커밋 ID : {commit}</p>
              </div>
            </div>
          </Col>
          <Col className='col-sm-3'></Col>
        </Row>


        <Row>
          <Col className='col-sm-12'>
            <h5 className='page-title'><i className='fas fa-play font-12'></i> Step</h5>
          </Col>
        </Row>
        <Row>
          <Col className='col-lg-3'>
            <div className={`card ${step === 1 ? 'bg-gradient2' : 'bg-dark'} text-white`}>
              <div className='card-body'>
                <p className='mb-0'>1. Pull <i className={`fab fa-github ${step===1 ? 'text-danger':'text-success'} font-20`}></i></p>
                <span className='font-12 text-light'>Git에서 프로젝트를 가져옵니다.</span>
              </div>
              <div className='progress mt-3'>
                <div className={`progress-bar ${step === 1 ? 'progress-bar-striped progress-bar-animated' : ''}`} role='progressbar'
                style={{width:`${step < 1 ? '0%' : '100%'}`}}
                aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
          </Col>
          <Col className='col-lg-3'>
            <div className={`card ${step === 2 ? 'bg-gradient2' : 'bg-dark'} text-white`}>
              <div className='card-body'>
                <p className='mb-0'>2. Build <i className={`fab fa-github ${step===2 ? 'text-danger':'text-success'} font-20`}></i></p>
                <span className='font-12 text-light'>Gradle로 빌드합니다.</span>
              </div>
              <div className='progress mt-3'>
                <div className={`progress-bar ${step === 2 ? 'progress-bar-striped progress-bar-animated' : ''}`} role='progressbar'
                style={{width:`${step < 2 ? '0%' : '100%'}`}}
                aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
          </Col>
          <Col className='col-lg-3'>
            <div className={`card ${step === 3 ? 'bg-gradient2' : 'bg-dark'} text-white`}>
              <div className='card-body'>
                <p className='mb-0'>3. Install <i className={`fab fa-github ${step===3 ? 'text-danger':'text-success'} font-20`}></i></p>
                <span className='font-12 text-light'>APK를 설치합니다.</span>
              </div>
              <div className='progress mt-3'>
                <div className={`progress-bar ${step === 3 ? 'progress-bar-striped progress-bar-animated' : ''}`} role='progressbar'
                style={{width:`${step < 3 ? '0%' : '100%'}`}}
                aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
          </Col>
          <Col className='col-lg-3'>
            <div className={`card ${step === 4 ? 'bg-gradient2' : 'bg-dark'} text-white`}>
              <div className='card-body'>
                <p className='mb-0'>4. RPM <i className={`fab fa-github ${step===4 ? 'text-danger':'text-success'} font-20`}></i></p>
                <span className='font-12 text-light'>소모 전류를 측정합니다.</span>
              </div>
              <div className='progress mt-3'>
                <div className={`progress-bar ${step === 4 ? 'progress-bar-striped progress-bar-animated' : ''}`} role='progressbar'
                style={{width:`${step < 4 ? '0%' : '100%'}`}}
                aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
          </Col>
          
        </Row>


        <Row>
          <Col className='col-sm-12'>
            <h5 className='page-title'><i className='fas fa-chart-line'></i> Charts</h5>
          </Col>
        </Row>
        <Row>
          <Col className='col-sm-12'>
            <div className='card'>
              <div className='card-body'>
                <Line ref={chartRef} onClick={chartClick} data={chart.info} options={{responsive : true}} />
              </div>
            </div>
          </Col>
        </Row>


        <Row>
          <Col className='col-sm-12'>
            <h5 className='page-title'><i className='fas fa-terminal'></i> Log</h5>
          </Col>
        </Row>
        <Row>
          <Col className='col-sm-12'>
            <div className='card'>
              <div className='card-body bg-dark text-success'>
                <ul>
                  {log.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
              <Button onClick={()=>setLog(new Array<string>())}>Clear</Button>
            </div>
          </Col>
        </Row>








      </div>

    </div>
  );
}

export default App;

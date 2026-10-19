import './App.css'
import { useEffect, useState } from 'react';
import { Form, Button, FormLabel } from 'react-bootstrap';
import api from './api/axios';

function App() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const platforms = ['Fiver', 'YouTube','LinkedIn','Facebook'];
  const [history, setHistory] = useState([]);
  const getDeductions = (income, deductions) => Number(income || 0) - Number(deductions || 0);

  useEffect(() => {
    api.get('/income-records')
      .then(response => {
        console.log('response', response);
        setHistory(response.data.data);
      })
      .catch(error => 
        console.error('Axios error:', error));
      },[]);
 
   const [Record, setRecord] = useState(
    {
      platform: platforms[0],
      income: 0,
      deductions: 0,
      month: 'January',
    }
  );
  
  const submit=()=>{
    
    const payload = {...Record, recordTotal: getDeductions(Record.income, Record.deductions)}
    
    api.post('/income-records', payload)
      .then(response => {
        console.log('response', response);
        setHistory(currentHistory => [
          response.data.data,
          ...currentHistory,
        ]);
        setRecord({
        platform: Record.platform,
        income: 0,
        deductions: 0,
        month: 'January',
    });
      })
      .catch(error => 
        console.error('Axios error:', error));
    
    
  }
    console.log('history', history);
  
  return (
    <>
      <section id="center">
        <div className="w-100 px-4">
          <h2>Income form</h2>
          <Form >
            <Form.Group className="mb-3 d-flex" controlID="formBasicsEmail">
              <FormLabel className="me-2">Select the month</FormLabel>
            <Form.Select className="w-25 mb-4" aria-label="Default select example" onChange={(e) => setRecord({...Record, month: e.target.value})} value={Record.month}>
              {months.map(m=> <option key={m} value={m}>{m}</option>)}
         </Form.Select>
    </Form.Group>

            <Form.Group className="mb-3 d-flex" controlID="formBasicsEmail">
              <FormLabel className="me-2">Select the platform</FormLabel>
            <Form.Select className="w-25 mb-4" aria-label="Default select example" onChange={(e) => setRecord({...Record, platform: e.target.value})} value={Record.platform}>
              {platforms.map(p=> <option key={p} value={p}>{p}</option>)}
         </Form.Select>
    </Form.Group>

      <Form.Group className="mb-3 d-flex align-items-center" controlId="formBasicEmail">
        <Form.Label className="me-2"> Record Data</Form.Label>
        <Form.Control className="me-2" type="text" placeholder="Enter Income" value={Record.income} onChange={(e) => setRecord({...Record, income: e.target.value})} />
        <Form.Control className="me-2" type="text" placeholder="Enter deductions" value={Record.deductions} onChange={(e) => setRecord({...Record, deductions: e.target.value})} />
        <Form.Control type="number" disabled value={getDeductions(Record.income, Record.deductions)} />
      </Form.Group>

      <Button variant="primary" onClick={()=>submit()}>
        Submit
      </Button>
    </Form>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div className="w-100 px-4">
      <h2>Past incomes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Month</th>
              <th>Platform</th>
              <th>Income</th>
              <th>Deductions</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              history?.map( (r)=>(
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.month}</td>
                  <td>{r.platform}</td>
                  <td>{r.income}</td>
                  <td>{r.deductions}</td>
                  <td>{r.record_total ?? r.recordTotal}</td>
                </tr>
              ))
            }
            
          </tbody>
        </table>
        </div>
        
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

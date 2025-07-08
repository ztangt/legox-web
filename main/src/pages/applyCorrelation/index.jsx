import ApplyCorrelation from "./components/applyCorrelation";

export default ({location})=>{
    return (
            <div style={{height: '100%'}}>
        <ApplyCorrelation id='applyCorrelation_container' location={location}/>
            </div>
    )
}
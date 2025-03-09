'use client'
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "./exampleSlice";
import { RootState } from "../../store";

const ExampleReduxComponent = () => {

    const count = useSelector((state: RootState) => state.counterReducer.value)
    const dispatch = useDispatch()
    return (

        <div>
            {/* for redux components,
       make it their own ocmponents to use 'use client'
        inside, instead of wrapping the entire page with use client */}
            <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    Increment
                </button>
                <span>{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    Decrement
                </button>
            </div>
        </div>);
}

export default ExampleReduxComponent;
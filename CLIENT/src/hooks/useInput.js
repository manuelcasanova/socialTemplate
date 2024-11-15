import useLocalStorage from "./useLocalStorage";

const useInput = (key, initValue) => {
    const [value, setValue] = useLocalStorage(key, initValue);

    // console.log("value", value)

    const reset = () => setValue(initValue);

    const attributeObj = {
        value,
        onChange: (e) => setValue(e.target.value)
    }

    return [value, reset, attributeObj];
}

export default useInput 
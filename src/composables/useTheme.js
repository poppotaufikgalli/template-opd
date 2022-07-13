import { ref, onMounted } from 'vue';

export function useTheme(){
    const saveTheme = localStorage.getItem('theme');
    const theme = ref(saveTheme);

    onMounted(() => {
        //console.log(saveTheme);
        //theme.value = saveTheme;
        theme.value = theme.value =='dark' ? 'light' : 'dark';
        toggleTheme();
    });

    function toggleTheme() {
        if (theme.value === 'dark') {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    }

    function setLightTheme(){
        theme.value = 'light';
        let htmlElement = document.documentElement;
        
        htmlElement.setAttribute('theme', 'light');
        localStorage.setItem('theme', 'light');
    }

    function setDarkTheme(){
        theme.value = 'dark';
        let htmlElement = document.documentElement;
        
        htmlElement.setAttribute('theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }

    return { theme, toggleTheme }
}
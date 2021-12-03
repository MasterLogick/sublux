import {isLogged} from "../Authorization";
import axios from "axios";

export default function getMyTasks(user) {
    if (isLogged(user)) {
        return new Promise((resolve, reject) => {
                let unusedTasks = [];

                function fetch(currentPage, perPage, total) {
                    axios.get("/api/task/getMy", {
                        params: {
                            page: currentPage,
                            perPage: perPage
                        }
                    }).then(resp => {
                            unusedTasks = unusedTasks.concat(resp.data.content);
                            total = resp.data.totalElements;
                            if (total > (currentPage + 1) * perPage) {
                                fetch(currentPage + 1, perPage, total);
                            } else {
                                resolve(unusedTasks);
                            }
                        }
                    ).catch(reject);
                }

                fetch(0, 20, 1);
            }
        );
    } else {
        return Promise.reject("Unauthorized access");
    }
}
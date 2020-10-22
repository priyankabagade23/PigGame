package com.priyanka_bagade.projects;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class JsController {

    @RequestMapping(value = "/piggame")
    public String getIndex(){
        return "piggame";
    }


    @RequestMapping(value = "/budgety")
    public String getBudget() {return "budgety";}


}

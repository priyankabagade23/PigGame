package com.priyanka_bagade.projects;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class JsController {

    @RequestMapping(value = "/index")
    public String getIndex(){
        return "index";
    }


}

package main2

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
)

func main2() {
	values := url.Values{
		"query": {"hello world"},
	}
	resp, err := http.Get("http://abehiroshi.la.coocan.jp" + "?" + values.Encode())
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	log.Println(string(body))
	log.Println(resp)
	log.Println("Status:", resp.Status)
	log.Println("StatusCode", resp.StatusCode)
	log.Println("Headers", resp.Header)
}

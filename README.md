serviz
======
# What is Serviz?

Serviz is an implementation of the runtime topology applied to SOA-based systems. More specifically, Serviz displays runtime information of how web services interact with each other (dynamically) in a running system.

# What are Serviz' components?

Serviz is composed of three components:
* a database - built using Apache Derby, where all the data is stored for visualization.
* a web application - built using HTML, jQuery, jQuery-UI, Timeline and RaphaelJS, which displays the data.
* a Java servlet - which serves as an interface to collect the data from the database into Javascript.

Additionally, a Java request handler is available to be used with Turmeric SOA, the services platform we currently use. This part is, however, concerned with data extraction and we include it simply for academic purposes.

# Quick start

In order to make it easier to get started with Serviz, we package Jetty binaries with all the required components and data to visualize the runtime topology of a previously running system.

These binaries can be found in the Downloads page of this repository.

# More info

If you're interested not just in getting Serviz to run but also in understanding how it works, read on.

Serviz is essentially an HTML page with Javascript which loads the data and displays it in a visualizable manner. To obtain this data, we require a Java servlet which pulls the data from the database (based on HTTP arguments) and outputs it as JSON data.

The Javascript then takes care of loading the JSON and painting a pretty picture with it.

You probably noticed that a database is involved in this process. For this particular purpose, we use Apache Derby (also in Java) to store the data.

In this project you will find both the servlet as well as the database. We also provided some stub data that you can easily import into Derby using DdlUtils so you actually have some data to visualize.
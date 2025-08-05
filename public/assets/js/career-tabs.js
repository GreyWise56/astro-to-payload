const tabContents={Overview:`
        <div class="flex flex-col gap-8 lg:flex-row reveal-me">
        <aside class="min-w-[275px] mx-auto flex-1">
          <div class="sticky top-5">
           <div class="reveal-me">
                <h3 class="max-md:text-[40px] md:text-[32px] mt-2 mb-10">
                  Job description
                </h3>
                <ul class="[&>*:not(:last-child)]:mb-4">
                  <li>
                    <a
                      href="#our-service-includes"
                      class="text-xl normal-case font-normal leading-7 dark:text-dark-100 hover:font-medium hover:text-secondary dark:hover:text-backgroundBody transition-all"
                    >
                      Responsibilities
                    </a>
                  </li>
                  <li>
                    <a
                      href="#why-choose"
                      class="text-xl normal-case font-normal leading-7 dark:text-dark-100 hover:font-medium hover:text-secondary dark:hover:text-backgroundBody transition-all"
                    >
                      Requirements
                    </a>
                  </li>
                  <li>
                    <a
                      href="#Wireframing the findings of the research"
                      class="text-xl normal-case font-normal leading-7 dark:text-dark-100 hover:font-medium hover:text-secondary dark:hover:text-backgroundBody transition-all"
                    >
                      Your Benefits
                    </a>
                  </li>
                </ul>
              </div>
          </div>
        </aside>
  
  
        <article class="blog-details-body">
          <h3 id="Job description">Job description</h3>
          <p>
            More than 80% of the public reviews by our users mention amazing and
            super fast ever you have for think about that is a long established
            fact that a reader will be distracted by the readable content of page
            when looking at its layout. The point of using Lorem Ipsum is that it
            has a more-or-less normal distribution of letters, as opposed to using
            'Content here, content here More than 80% of the public reviews by our
            users mention amazing and super fast ever you have for think about
            that is a long <br />
            <br />
            Established fact that a reader will be distracted by the readable
            content of page when looking at its layout. The point of using Lorem
            Ipsum is that it has a more-or-less normal distribution letters as
            opposed to using Content here, content here
          </p>
  
          <h3 id="Responsibilities">Responsibilities</h3>
          <p>
            Here are some typical job application requirements that you may want
            to include when posting a job or applying for one::
          </p>
  
          <ul>
            <li>
              Resume/CV: A detailed document outlining your work experience,
              education, and skills relevant to the job.
            </li>
            <li>
              Cover Letter: A personalized letter that explains why you are a good
              fit for the position and organization.
            </li>
            <li>
              Educational Qualifications: The minimum level of education required,
              such as a high school diploma, bachelor’s degree, or specialized
              certification.
            </li>
            <li>
              Technical Skills: Any required proficiency in software, tools, or
              technologies related to the position.
            </li>
          </ul>
          <p>
            These are general elements, but the specifics can vary depending on
            the company and the nature of the job.
          </p>

           <h3 id="Requirements">Requirements</h3>
            <p>
              Established fact that a reader will be distracted by the readable
              content of page when looking at its layout. The point of using
              Lorem Ipsum is that it has a more-or-less normal distribution
              letters as opposed to using Content here, content here
            </p>

            <ul>
              <li>
                Resume/CV: A detailed document outlining your work experience,
                education, and skills relevant to the job.
              </li>
              <li>
                Cover Letter: A personalized letter that explains why you are a
                good fit for the position and organization.
              </li>
              <li>
                Educational Qualifications: The minimum level of education
                required, such as a high school diploma, bachelor’s degree, or
                specialized certification.
              </li>
              <li>
                Technical Skills: Any required proficiency in software, tools,
                or technologies related to the position.
              </li>
            </ul>
            <p>
              These are general elements, but the specifics can vary depending
              on the company and the nature of the job.
            </p>
  
          <h3 id="Your Benefits">Your Benefits</h3>
          <p>
            Established fact that a reader will be distracted by the readable
            content of page when looking at its layout. The point of using Lorem
            Ipsum is that it has a more-or-less normal distribution letters as
            opposed to using Content here, content here
          </p>
  
          <ul>
            <li>
              Resume/CV: A detailed document outlining your work experience,
              education, and skills relevant to the job.
            </li>
            <li>
              Cover Letter: A personalized letter that explains why you are a good
              fit for the position and organization.
            </li>
            <li>
              Educational Qualifications: The minimum level of education required,
              such as a high school diploma, bachelor’s degree, or specialized
              certification.
            </li>
            <li>
              Technical Skills: Any required proficiency in software, tools, or
              technologies related to the position.
            </li>
          </ul>
          <p>
            These are general elements, but the specifics can vary depending on
            the company and the nature of the job.
          </p>
        </article>
      </div>
    `,Apply:`
       <form class="space-y-[30px] max-w-[770px] mx-auto">
            <div class="w-full">
              <div class="border border-secondary/10 dark:border-dark p-4">
                <div class="flex flex-wrap justify-between items-center">
                  <div class="space-y-1">
                    <h3
                      class="text-[21px] text-secondary/30 dark:text-backgroundBody/30 leading-7 tracking-[0.4px] mb-2"
                    >
                      Autofill from resume
                    </h3>
                    <p
                      class="text-base text-secondary/30 dark:text-backgroundBody/30 leading-[1.4] tracking-[0.32px]"
                    >
                      Upload your resume here to autofill key application fields.
                    </p>
                  </div>
  
                  <label class="relative">
                    <input
                      type="file"
                      class="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg"
                      onchange="document.getElementById('file-name').textContent = this.files[0] ? 'Selected file: ' + this.files[0].name : ''"
                    />
                    <span
                      class="inline-flex px-4 py-2 rounded-full bg-backgroundBody dark:bg-dark/10 border border-secondary/30 dark:border-backgroundBody/30 text-[12px] text-secondary/70 dark:text-backgroundBody/70 hover:bg-gray-100 dark:hover:bg-dark-300 cursor-pointer transition-colors"
                    >
                      Upload File
                    </span>
                  </label>
                </div>
  
                <div id="file-name"></div>
              </div>
            </div>
  
            <div class="w-full">
              <label
                for="name"
                class="text-2xl leading-[1.2] tracking-[-0.48px] text-[#000000b3] dark:text-dark-100"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                class="py-4 pl-5 bg-backgroundBody dark:bg-dark focus:outline-none focus:border-primary border dark:border-dark w-full text-colorText placeholder:text-secondary/30 placeholder:dark:text-backgroundBody/30 text-xl leading-[1.4] tracking-[0.4px] mt-3"
              />
            </div>
  
            <div class="w-full">
              <label
                for="email"
                class="text-2xl leading-[1.2] tracking-[-0.48px] text-[#000000b3] dark:text-dark-100"
              >
                Email*
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                class="py-4 pl-5 bg-backgroundBody dark:bg-dark focus:outline-none focus:border-primary border dark:border-dark w-full text-colorText placeholder:text-secondary/30 placeholder:dark:text-backgroundBody/30 text-xl leading-[1.4] tracking-[0.4px] mt-3"
              />
            </div>
  
            <div class="w-full">
              <label
                for="email"
                class="text-2xl leading-[1.2] tracking-[-0.48px] text-[#000000b3] dark:text-dark-100"
              >
                Resume*
              </label>
              <div class="border border-secondary/10 dark:border-dark p-4 mt-3">
                <div class="flex justify-between items-center">
                  <div class="flex flex-wrap items-center mx-auto gap-5">
                    <label class="relative">
                      <input
                        type="file"
                        class="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg"
                        onchange="document.getElementById('file-name').textContent = this.files[0] ? 'Selected file: ' + this.files[0].name : ''"
                      />
  
                      <figure
                        class="inline-flex gap-2 px-6 py-3 rounded-full  dark:bg-dark/10 border border-secondary/30 dark:border-backgroundBody/30 text-base text-secondary/70 dark:text-backgroundBody/70 hover:bg-gray-100 dark:hover:bg-dark-300 cursor-pointer transition-colors"
                      >
                        <img
                          src="images/icons/file-upload.svg"
                          class="inline-flex left-0 dark:hidden"
                          alt="drag&drop"
                        />
                        <img
                          src="images/icons/file-upload-dark.svg"
                          class=" left-0 dark:inline hidden"
                          alt="drag&drop"
                        />
                        <span> Upload File </span>
                      </figure>
                    </label>
                    <h3
                      class="text-[21px] text-secondary/70 dark:text-backgroundBody/70 leading-7 tracking-[0.4px] mb-2"
                    >
                      Or drag and drop here
                    </h3>
                  </div>
                </div>
  
                <div id="file-name" class=""></div>
              </div>
            </div>
            <div class="w-full">
            <input
          type="submit"
          value="Submit Application"
          class="bg-primary dark:bg-backgroundBody hover:bg-primary/30 cursor-pointer duration-300 dark:hover:bg-backgroundBody/90 text-secondary  p-8 uppercase w-full "
        />
            </div>
          </form>
    `};function switchTab(e){var t;for(t of document.getElementsByClassName("tab-button"))t.classList.remove("active");const a=document.querySelector(`[onclick="switchTab('${e}')"]`);a.classList.add("active");const o=document.getElementById("tab-content-container"),i=document.createElement("div");for(i.id=e,i.className="tab-content",i.innerHTML=tabContents[e];o.firstChild;)o.removeChild(o.firstChild);o.appendChild(i)}
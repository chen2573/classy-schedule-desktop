
/**
 * This service was created to deal with async issues and state management issues from app.js.
 * Preferences are based on classes and professors, so these states must be available when we map
 * preferences to the courses. This service takes care of this mapping.
 */
class PreferenceService {
    constructor() {
        this.courses = [];
        this.preferences = [];
    }
    
    /**
     * Sets courses from the state of app.js
     * @param courses - a list of courses that comes form app.js
     */
    setCourses(courses) {
        this.courses = [...courses]
    }

    /**
     * Sets the professors for this object from app.js
     * @param professors - a list of professors that comes from app.js
     */
    setProfessors(professors) {
        this.professors = [...professors]
    }

    /**
     * Returns a list of courses
     * @returns a list of courses
     */
    getCourses() {
        return this.courses;
    }

    /**
     * Returna a list of professors
     * @returns list of professors
     */
    getProfessors() {
        return this.professors;
    }

    /**
     * Clears all data;
     */
    clearData() {
        this.courses = [];
        this.professors = [];
    }

    /**
    * Gets the latest data for professors.
    */
    getLatestProfessorTeachPreferences() {  
        let _payload = {
          request: 'REFRESH_TEACH_PREFS',
          message: 'Renderer REFRESH for Professors Teach Preferences',
        }
    
        // Send a query to main
        window.DB.send('toMain:Prefs', _payload);
    
        // Recieve the results
        return new Promise((resolve, reject) => {
            window.DB.receive('fromMain:Prefs', (dataRows) => {
                let tempProfessorsWithPreferences = [];
                let profsIdsWithPrefs = [];
                
                console.log(dataRows);
                dataRows.map((data) => {
                //console.log(data);
                tempProfessorsWithPreferences.push(mapTeachPrefsToProfessor(data.prof_id, data.class_preferences, this.professors, this.courses));
                profsIdsWithPrefs.push(data.prof_id);
                });
        
                //console.log(tempProfessorsWithPreferences);
        
                tempProfessorsWithPreferences.push.apply(tempProfessorsWithPreferences, [...getProfessorWithNoPreferences(profsIdsWithPrefs, this.professors)]);
                
                //if(tempProfessorsWithPreferences[0] != undefined || tempProfessorsWithPreferences[0] != null)
                console.log(tempProfessorsWithPreferences);
                
                resolve(tempProfessorsWithPreferences);
                
            })
        });
    }
}

/**
   * This function maps teacher preferences to the professor id that is provided.
   * @param profId - the id of the professor we are mapping.
   * @param preferences - all the preferences that come from the db.
   */
   function mapTeachPrefsToProfessor(profId, preferences, professors, courses){
    let tempProfessors = professors;
    let canTeach = [];
    let wantTeach = [];

    for(let i=0; i<preferences.length; i++){
      if(preferences[i].can_teach && classExistsInState(preferences[i].class_id, courses)){
        let temp = getClassNameFromId(preferences[i].class_id, courses);
        canTeach.push(temp);
      }
      if(preferences[i].prefer_to_teach && classExistsInState(preferences[i].class_id, courses)){
        let temp = getClassNameFromId(preferences[i].class_id, courses);
        wantTeach.push(temp);
      }
    }

    for(const key in tempProfessors) {
      if(tempProfessors[key].id === profId){
        tempProfessors[key].canTeach = canTeach;
        tempProfessors[key].wantTeach = wantTeach;

        return tempProfessors[key];
      }
    }
  }

  /**
   * This function returns an array of all the teachers that do not have any preferences saved to the DB.
   * @param professorIdWithPrefs - a list of the professor ids that already have preferences added.
   * @returns 
   */
  function getProfessorWithNoPreferences(professorIdWithPrefs, professors) {
    let tempProfessors = professors;
    let retProfs = [];

    for(const key in tempProfessors) {
      let index = professorIdWithPrefs.indexOf(tempProfessors[key].id);

      if(index === -1){
        retProfs.push(tempProfessors[key]);
      }
    }

    return retProfs;
  }

  /**
   * This function is an extra precaution to make sure we are not including preferences for classes that do not exist.
   * @param classId - the class we are checking for.
   */
  function classExistsInState(classId, courses) {
    let tempCourses = courses;

    for(let i=0; i<tempCourses.length; i++) {
      if(tempCourses[i].id === classId){
        return true;
      }
    }
    return false;
  }

  function getClassNameFromId(classId, courses) {
    let tempCourses = courses;

    for(let i=0; i<tempCourses.length; i++) {
      if(tempCourses[i].id === classId){
        return tempCourses[i];
      }
    }
  }

/**
 * Exports the entire DataBaseService class, having access to all its functions.
 */
export default PreferenceService;